import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import {
  makePaymentTxnWithSuggestedParams,
  type SuggestedParams,
  type Transaction,
} from 'algosdk';

// enums
import { ThunkEnum } from '../enums';

// errors
import {
  BaseExtensionError,
  FailedToSendTransactionError,
  MalformedDataError,
  NotEnoughMinimumBalanceError,
} from '@extension/errors';

// models
import NetworkClient from '@extension/models/NetworkClient';

// services
import AccountService from '@extension/services/AccountService';

// types
import type {
  IAccountInformation,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';
import type { TReKeyAccountThunkPayload } from '../types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import doesAccountFallBelowMinimumBalanceRequirementForTransactions from '@extension/utils/doesAccountFallBelowMinimumBalanceRequirementForTransactions';
import signTransaction from '@extension/utils/signTransaction';
import selectNodeIDByGenesisHashFromSettings from '@extension/utils/selectNodeIDByGenesisHashFromSettings/selectNodeIDByGenesisHashFromSettings';

const reKeyAccountThunk: AsyncThunk<
  string | null, // return
  TReKeyAccountThunkPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  string | null,
  TReKeyAccountThunkPayload,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  ThunkEnum.ReKeyAccount,
  async (
    { authorizedAddress, network, reKeyAccount, ...encryptionOptions },
    { getState, rejectWithValue }
  ) => {
    const accounts = getState().accounts.items;
    const logger = getState().system.logger;
    const accountInformation: IAccountInformation | null =
      AccountService.extractAccountInformationForNetwork(reKeyAccount, network);
    const address = convertPublicKeyToAVMAddress(reKeyAccount.publicKey);
    const networks = getState().networks.items;
    const settings = getState().settings;
    let _error: string;
    let networkClient: NetworkClient;
    let nodeID: string | null;
    let signedTransaction: Uint8Array;
    let suggestedParams: SuggestedParams;
    let unsignedTransaction: Transaction;

    if (!accountInformation) {
      _error = `no account information for "${address}" found`;

      logger.debug(`${ThunkEnum.ReKeyAccount}: ${_error}`);

      return rejectWithValue(new MalformedDataError(_error));
    }

    networkClient = new NetworkClient({ logger, network });
    nodeID = selectNodeIDByGenesisHashFromSettings({
      genesisHash: network.genesisHash,
      settings,
    });

    unsignedTransaction = makePaymentTxnWithSuggestedParams(
      address,
      address,
      BigInt('0'),
      undefined,
      undefined,
      await networkClient.suggestedParams(nodeID),
      authorizedAddress // re-key new address
    );

    // ensure the transaction does not fall below the minimum balance requirement
    if (
      doesAccountFallBelowMinimumBalanceRequirementForTransactions({
        account: reKeyAccount,
        logger,
        network,
        transactions: [unsignedTransaction],
      })
    ) {
      _error = `total transaction cost will bring the account "${address}" balance below the minimum balance requirement`;

      logger.debug(`${ThunkEnum.ReKeyAccount}: ${_error}`);

      return rejectWithValue(new NotEnoughMinimumBalanceError(_error));
    }

    try {
      signedTransaction = await signTransaction({
        ...encryptionOptions,
        accounts,
        authAccounts: accounts,
        logger,
        networks,
        unsignedTransaction,
      });

      await networkClient.sendTransactions({
        signedTransactions: [signedTransaction],
        nodeID,
      });

      return unsignedTransaction.txID();
    } catch (error) {
      logger.error(`${ThunkEnum.ReKeyAccount}:`, error);

      if ((error as BaseExtensionError).code) {
        return rejectWithValue(error);
      }

      return rejectWithValue(new FailedToSendTransactionError(error.message));
    }
  }
);

export default reKeyAccountThunk;
