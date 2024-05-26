import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import {
  Algodv2,
  makePaymentTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
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

// services
import AccountService from '@extension/services/AccountService';

// types
import type {
  IAccountInformation,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';
import type { IUndoReKeyAccountThunkPayload } from '../types';

// utils
import createAlgodClient from '@common/utils/createAlgodClient';
import doesAccountFallBelowMinimumBalanceRequirementForTransactions from '@extension/utils/doesAccountFallBelowMinimumBalanceRequirementForTransactions';
import sendTransactionsForNetwork from '@extension/utils/sendTransactionsForNetwork';
import signTransaction from '@extension/utils/signTransaction';

const undoReKeyAccountThunk: AsyncThunk<
  string | null, // return
  IUndoReKeyAccountThunkPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  string | null,
  IUndoReKeyAccountThunkPayload,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  ThunkEnum.UndoReKeyAccount,
  async ({ account, network, password }, { getState, rejectWithValue }) => {
    const accounts = getState().accounts.items;
    const logger = getState().system.logger;
    const accountInformation: IAccountInformation | null =
      AccountService.extractAccountInformationForNetwork(account, network);
    const address = AccountService.convertPublicKeyToAlgorandAddress(
      account.publicKey
    );
    const networks = getState().networks.items;
    let _error: string;
    let algodClient: Algodv2;
    let signedTransaction: Uint8Array;
    let suggestedParams: SuggestedParams;
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

    algodClient = createAlgodClient(network, { logger });
    suggestedParams = await algodClient.getTransactionParams().do();
    unsignedTransaction = makePaymentTxnWithSuggestedParams(
      address,
      address,
      BigInt('0'),
      undefined,
      undefined,
      suggestedParams,
      address // re-key back to the original address
    );

    // ensure the transaction does not fall below the minimum balance requirement
    if (
      doesAccountFallBelowMinimumBalanceRequirementForTransactions({
        account,
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
        password,
        unsignedTransaction,
      });

      await sendTransactionsForNetwork({
        logger,
        network,
        signedTransactions: [signedTransaction],
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
