import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { Address, decodeAddress } from 'algosdk';
import browser from 'webextension-polyfill';

// enums
import { SendAssetsThunkEnum } from '@extension/enums';

// errors
import {
  DecryptionError,
  FailedToSendTransactionError,
  MalformedDataError,
  NetworkNotSelectedError,
  OfflineError,
} from '@extension/errors';

// services
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IAsyncThunkConfigWithRejectValue,
  IMainRootState,
  INetwork,
} from '@extension/types';
import type { ISubmitTransactionsThunkPayload } from '../types';

// utils
import isAccountKnown from '@extension/utils/isAccountKnown';
import signAndSendTransactions from '@extension/utils/signAndSendTransactions';
import uniqueGenesisHashesFromTransactions from '@extension/utils/uniqueGenesisHashesFromTransactions';

const submitTransactionThunk: AsyncThunk<
  string[], // return
  ISubmitTransactionsThunkPayload, // args
  IAsyncThunkConfigWithRejectValue<IMainRootState>
> = createAsyncThunk<
  string[],
  ISubmitTransactionsThunkPayload,
  IAsyncThunkConfigWithRejectValue<IMainRootState>
>(
  SendAssetsThunkEnum.SubmitTransaction,
  async ({ password, transactions }, { getState, rejectWithValue }) => {
    const accounts: IAccount[] = getState().accounts.items;
    const fromAddress: string | null = getState().sendAssets.fromAddress;
    const logger: ILogger = getState().system.logger;
    const genesisHash: string | null =
      uniqueGenesisHashesFromTransactions(transactions).pop() || null;
    const networks: INetwork[] = getState().networks.items;
    const online: boolean = getState().system.online;
    let errorMessage: string;
    let decodedFromAddress: Address;
    let network: INetwork | null;
    let privateKey: Uint8Array | null;
    let privateKeyService: PrivateKeyService;

    if (!fromAddress) {
      errorMessage = `fromAddress field missing`;

      logger.debug(`${SendAssetsThunkEnum.SubmitTransaction}: ${errorMessage}`);

      return rejectWithValue(new MalformedDataError(errorMessage));
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
      errorMessage = `no network configuration found for "${genesisHash}"`;

      logger.debug(`${SendAssetsThunkEnum.SubmitTransaction}: ${errorMessage}`);

      return rejectWithValue(new NetworkNotSelectedError(errorMessage));
    }

    // check if we actually have the account
    if (!isAccountKnown(accounts, fromAddress)) {
      errorMessage = `no account data found for "${fromAddress}" in wallet`;

      logger.debug(`${SendAssetsThunkEnum.SubmitTransaction}: ${errorMessage}`);

      return rejectWithValue(new MalformedDataError(errorMessage));
    }

    privateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });

    // attempt to decrypt the key suing the password
    try {
      decodedFromAddress = decodeAddress(fromAddress);
      privateKey = await privateKeyService.getDecryptedPrivateKey(
        decodedFromAddress.publicKey,
        password
      );

      if (!privateKey) {
        return rejectWithValue(
          new DecryptionError(
            `failed to get private key for signer "${fromAddress}"`
          )
        );
      }
    } catch (error) {
      logger.debug(
        `${SendAssetsThunkEnum.SubmitTransaction}(): ${error.message}`
      );

      return rejectWithValue(error);
    }

    try {
      return await signAndSendTransactions({
        logger,
        network,
        privateKey,
        unsignedTransactions: transactions,
      });
    } catch (error) {
      logger.error(`${SendAssetsThunkEnum.SubmitTransaction}:`, error);

      return rejectWithValue(new FailedToSendTransactionError(error.message));
    }
  }
);

export default submitTransactionThunk;
