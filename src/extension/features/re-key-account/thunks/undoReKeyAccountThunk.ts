import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { makePaymentTxnWithSuggestedParams, type Transaction } from 'algosdk';

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
import AccountRepositoryService from '@extension/repositories/AccountRepositoryService';

// types
import type {
  IAccountInformation,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';
import type { TUndoReKeyAccountThunkPayload } from '../types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import doesAccountFallBelowMinimumBalanceRequirementForTransactions from '@extension/utils/doesAccountFallBelowMinimumBalanceRequirementForTransactions';
import selectNodeIDByGenesisHashFromSettings from '@extension/utils/selectNodeIDByGenesisHashFromSettings/selectNodeIDByGenesisHashFromSettings';
import signTransaction from '@extension/utils/signTransaction';

const undoReKeyAccountThunk: AsyncThunk<
  string | null, // return
  TUndoReKeyAccountThunkPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  string | null,
  TUndoReKeyAccountThunkPayload,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  ThunkEnum.UndoReKeyAccount,
  async (
    { network, reKeyAccount, ...encryptionOptions },
    { getState, rejectWithValue }
  ) => {
    const accounts = getState().accounts.items;
    const logger = getState().system.logger;
    const accountInformation: IAccountInformation | null =
      AccountRepositoryService.extractAccountInformationForNetwork(
        reKeyAccount,
        network
      );
    const address = convertPublicKeyToAVMAddress(reKeyAccount.publicKey);
    const networks = getState().networks.items;
    const settings = getState().settings;
    let _error: string;
    let networkClient: NetworkClient;
    let nodeID: string | null;
    let signedTransaction: Uint8Array;
    let unsignedTransaction: Transaction;

    if (!accountInformation) {
      _error = `no account information for "${address}" found`;

      logger.debug(`${ThunkEnum.UndoReKeyAccount}: ${_error}`);

      return rejectWithValue(new MalformedDataError(_error));
    }

    if (!accountInformation.authAddress) {
      logger.debug(
        `${ThunkEnum.UndoReKeyAccount}: account "${address}" is not re-keyed`
      );

      return null;
    }

    nodeID = selectNodeIDByGenesisHashFromSettings({
      genesisHash: network.genesisHash,
      settings,
    });
    networkClient = new NetworkClient({ logger, network });
    unsignedTransaction = makePaymentTxnWithSuggestedParams(
      address,
      address,
      BigInt('0'),
      undefined,
      undefined,
      await networkClient.suggestedParams(nodeID),
      address // re-key back to the original address
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

      logger.debug(`${ThunkEnum.UndoReKeyAccount}: ${_error}`);

      return rejectWithValue(new NotEnoughMinimumBalanceError(_error));
    }

    try {
      signedTransaction = await signTransaction({
        accounts,
        authAccounts: accounts,
        logger,
        networks,
        unsignedTransaction,
        ...encryptionOptions,
      });

      await networkClient.sendTransactions({
        signedTransactions: [signedTransaction],
        nodeID,
      });

      return unsignedTransaction.txID();
    } catch (error) {
      logger.error(`${ThunkEnum.UndoReKeyAccount}:`, error);

      if ((error as BaseExtensionError).code) {
        return rejectWithValue(error);
      }

      return rejectWithValue(new FailedToSendTransactionError(error.message));
    }
  }
);

export default undoReKeyAccountThunk;
