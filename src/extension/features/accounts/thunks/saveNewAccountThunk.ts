import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { encode as encodeHex } from '@stablelib/hex';
import { sign } from 'tweetnacl';
import browser from 'webextension-polyfill';

// errors
import {
  MalformedDataError,
  PrivateKeyAlreadyExistsError,
} from '@extension/errors';

// enums
import { AccountsThunkEnum } from '@extension/enums';

// services
import AccountService from '@extension/services/AccountService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IAsyncThunkConfigWithRejectValue,
  IPrivateKey,
} from '@extension/types';
import { ISaveNewAccountPayload } from '../types';

const saveNewAccountThunk: AsyncThunk<
  IAccount, // return
  ISaveNewAccountPayload, // args
  IAsyncThunkConfigWithRejectValue
> = createAsyncThunk<
  IAccount,
  ISaveNewAccountPayload,
  IAsyncThunkConfigWithRejectValue
>(
  AccountsThunkEnum.SaveNewAccount,
  async (
    { name, password, privateKey },
    { dispatch, getState, rejectWithValue }
  ) => {
    const encodedPublicKey: string = encodeHex(
      sign.keyPair.fromSecretKey(privateKey).publicKey
    ).toUpperCase();
    const logger: ILogger = getState().system.logger;
    let account: IAccount;
    let accountService: AccountService;
    let errorMessage: string;
    let privateKeyItem: IPrivateKey | null;
    let privateKeyService: PrivateKeyService;

    logger.debug(`${AccountsThunkEnum.SaveNewAccount}: inferring public key`);

    privateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });

    privateKeyItem = await privateKeyService.getPrivateKeyByPublicKey(
      encodedPublicKey
    );

    if (privateKeyItem) {
      errorMessage = `private key for "${encodedPublicKey}" already exists`;

      logger.debug(`${AccountsThunkEnum.SaveNewAccount}: ${errorMessage}`);

      return rejectWithValue(new PrivateKeyAlreadyExistsError(errorMessage));
    }

    logger.debug(
      `${AccountsThunkEnum.SaveNewAccount}: saving private key "${encodedPublicKey}" to storage`
    );

    try {
      // add the new private key
      privateKeyItem = await privateKeyService.setPrivateKey(
        privateKey,
        password
      );
    } catch (error) {
      logger.error(`${AccountsThunkEnum.SaveNewAccount}: ${error.message}`);

      return rejectWithValue(error);
    }

    if (!privateKeyItem) {
      errorMessage = `failed to save private key "${encodedPublicKey}" to storage`;

      logger.debug(`${AccountsThunkEnum.SaveNewAccount}: ${errorMessage}`);

      return rejectWithValue(new MalformedDataError(errorMessage));
    }

    logger.debug(
      `${AccountsThunkEnum.SaveNewAccount}: successfully saved private key "${encodedPublicKey}" to storage`
    );

    account = AccountService.initializeDefaultAccount({
      publicKey: encodedPublicKey,
      ...(privateKeyItem && {
        createdAt: privateKeyItem.createdAt,
      }),
      ...(name && {
        name,
      }),
    });
    accountService = new AccountService({
      logger,
    });

    // save the account to storage
    await accountService.saveAccounts([account]);

    logger.debug(
      `${AccountsThunkEnum.SaveNewAccount}: saved account for "${encodedPublicKey}" to storage`
    );

    return account;
  }
);

export default saveNewAccountThunk;
