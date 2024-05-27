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
import type { IReKeyAccountThunkPayload } from '../types';

// utils
import createAlgodClient from '@common/utils/createAlgodClient';
import doesAccountFallBelowMinimumBalanceRequirementForTransactions from '@extension/utils/doesAccountFallBelowMinimumBalanceRequirementForTransactions';
import sendTransactionsForNetwork from '@extension/utils/sendTransactionsForNetwork';
import signTransaction from '@extension/utils/signTransaction';

const reKeyAccountThunk: AsyncThunk<
  string | null, // return
  IReKeyAccountThunkPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  string | null,
  IReKeyAccountThunkPayload,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  ThunkEnum.ReKeyAccount,
  async (
    { authorizedAddress, network, password, reKeyAccount },
    { getState, rejectWithValue }
  ) => {
    const accounts = getState().accounts.items;
    const logger = getState().system.logger;
    const accountInformation: IAccountInformation | null =
      AccountService.extractAccountInformationForNetwork(reKeyAccount, network);
    const address = AccountService.convertPublicKeyToAlgorandAddress(
      reKeyAccount.publicKey
    );
    const networks = getState().networks.items;
    let _error: string;
    let algodClient: Algodv2;
    let signedTransaction: Uint8Array;
    let suggestedParams: SuggestedParams;
    let unsignedTransaction: Transaction;

    if (!accountInformation) {
      _error = `no account information for "${address}" found`;

      logger.debug(`${ThunkEnum.ReKeyAccount}: ${_error}`);

      return rejectWithValue(new MalformedDataError(_error));
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
      logger.error(`${ThunkEnum.ReKeyAccount}:`, error);

      if ((error as BaseExtensionError).code) {
        return rejectWithValue(error);
      }

      return rejectWithValue(new FailedToSendTransactionError(error.message));
    }
  }
);

export default reKeyAccountThunk;
