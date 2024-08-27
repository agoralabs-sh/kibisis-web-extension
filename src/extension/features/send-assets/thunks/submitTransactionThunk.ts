import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { SendAssetsThunkEnum } from '@extension/enums';

// errors
import {
  BaseExtensionError,
  FailedToSendTransactionError,
  MalformedDataError,
  NetworkNotSelectedError,
  NotEnoughMinimumBalanceError,
  OfflineError,
} from '@extension/errors';

// models
import NetworkClient from '@extension/models/NetworkClient';

// types
import type {
  IAsyncThunkConfigWithRejectValue,
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';
import type { TSubmitTransactionsThunkPayload } from '../types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import doesAccountFallBelowMinimumBalanceRequirementForTransactions from '@extension/utils/doesAccountFallBelowMinimumBalanceRequirementForTransactions';
import isAccountKnown from '@extension/utils/isAccountKnown';
import selectNodeIDByGenesisHashFromSettings from '@extension/utils/selectNodeIDByGenesisHashFromSettings/selectNodeIDByGenesisHashFromSettings';
import signTransaction from '@extension/utils/signTransaction';
import uniqueGenesisHashesFromTransactions from '@extension/utils/uniqueGenesisHashesFromTransactions';

const submitTransactionThunk: AsyncThunk<
  string[], // return
  TSubmitTransactionsThunkPayload, // args
  IAsyncThunkConfigWithRejectValue<IMainRootState>
> = createAsyncThunk<
  string[],
  TSubmitTransactionsThunkPayload,
  IAsyncThunkConfigWithRejectValue<IMainRootState>
>(
  SendAssetsThunkEnum.SubmitTransaction,
  async (
    { transactions, ...encryptionOptions },
    { getState, rejectWithValue }
  ) => {
    const accounts = getState().accounts.items;
    const logger = getState().system.logger;
    const genesisHash =
      uniqueGenesisHashesFromTransactions(transactions).pop() || null;
    const networks = getState().networks.items;
    const online = getState().system.networkConnectivity.online;
    const sender = getState().sendAssets.sender;
    const settings = getState().settings;
    let _error: string;
    let network: INetworkWithTransactionParams | null;
    let networkClient: NetworkClient;
    let senderAddress: string;
    let signedTransactions: Uint8Array[];

    if (!sender) {
      _error = `sender not assigned`;

      logger.debug(`${SendAssetsThunkEnum.SubmitTransaction}: ${_error}`);

      return rejectWithValue(new MalformedDataError(_error));
    }

    if (!online) {
      logger.debug(
        `${SendAssetsThunkEnum.SubmitTransaction}: extension offline`
      );

      return rejectWithValue(
        new OfflineError('attempted to send transaction, but extension offline')
      );
    }

    if (!genesisHash) {
      logger.debug(
        `${SendAssetsThunkEnum.SubmitTransaction}: failed to get the genesis hash from the transactions`
      );

      return rejectWithValue(
        new MalformedDataError(
          'unable to determine genesis hash from transactions'
        )
      );
    }

    network =
      networks.find((value) => value.genesisHash === genesisHash) || null;

    if (!network) {
      _error = `no network configuration found for "${genesisHash}"`;

      logger.debug(`${SendAssetsThunkEnum.SubmitTransaction}: ${_error}`);

      return rejectWithValue(new NetworkNotSelectedError(_error));
    }

    senderAddress = convertPublicKeyToAVMAddress(sender.publicKey);

    // check if we actually have the account
    if (!isAccountKnown(accounts, senderAddress)) {
      _error = `no account data found for "${senderAddress}" in wallet`;

      logger.debug(`${SendAssetsThunkEnum.SubmitTransaction}: ${_error}`);

      return rejectWithValue(new MalformedDataError(_error));
    }

    // ensure the transaction does not fall below the minimum balance requirement
    if (
      doesAccountFallBelowMinimumBalanceRequirementForTransactions({
        account: sender,
        logger,
        network,
        transactions,
      })
    ) {
      _error = `total transaction cost will bring the account "${senderAddress}" balance below the minimum balance requirement`;

      logger.debug(`${SendAssetsThunkEnum.SubmitTransaction}: ${_error}`);

      return rejectWithValue(new NotEnoughMinimumBalanceError(_error));
    }

    try {
      signedTransactions = await Promise.all(
        transactions.map((value) =>
          signTransaction({
            accounts,
            authAccounts: accounts,
            logger,
            networks,
            unsignedTransaction: value,
            ...encryptionOptions,
          })
        )
      );

      networkClient = new NetworkClient({ logger, network });
      await networkClient.sendTransactions({
        nodeID: selectNodeIDByGenesisHashFromSettings({
          genesisHash: network.genesisHash,
          settings,
        }),
        signedTransactions,
      });

      return transactions.map((value) => value.txID());
    } catch (error) {
      logger.error(`${SendAssetsThunkEnum.SubmitTransaction}:`, error);

      if ((error as BaseExtensionError).code) {
        return rejectWithValue(error);
      }

      return rejectWithValue(new FailedToSendTransactionError(error.message));
    }
  }
);

export default submitTransactionThunk;
