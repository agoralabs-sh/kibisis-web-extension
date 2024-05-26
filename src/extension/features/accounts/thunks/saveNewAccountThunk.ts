import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { encode as encodeHex } from '@stablelib/hex';
import browser from 'webextension-polyfill';

// errors
import {
  MalformedDataError,
  PrivateKeyAlreadyExistsError,
} from '@extension/errors';

// enums
import { ThunkEnum } from '../enums';

// services
import AccountService from '@extension/services/AccountService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type {
  IAccountWithExtendedProps,
  IAsyncThunkConfigWithRejectValue,
  IPrivateKey,
} from '@extension/types';
import type { ISaveNewAccountPayload } from '../types';

const saveNewAccountThunk: AsyncThunk<
  IAccountWithExtendedProps, // return
  ISaveNewAccountPayload, // args
  IAsyncThunkConfigWithRejectValue
> = createAsyncThunk<
  IAccountWithExtendedProps,
  ISaveNewAccountPayload,
  IAsyncThunkConfigWithRejectValue
>(
  ThunkEnum.SaveNewAccount,
  async ({ name, password, privateKey }, { getState, rejectWithValue }) => {
    const encodedPublicKey: string = encodeHex(
      PrivateKeyService.extractPublicKeyFromPrivateKey(privateKey)
    ).toUpperCase();
    const logger = getState().system.logger;
    let account: IAccountWithExtendedProps;
    let accountService: AccountService;
    let errorMessage: string;
    let privateKeyItem: IPrivateKey | null;
    let privateKeyService: PrivateKeyService;

    logger.debug(`${ThunkEnum.SaveNewAccount}: inferring public key`);

    privateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });

    privateKeyItem = await privateKeyService.getPrivateKeyByPublicKey(
      encodedPublicKey
    );

    if (privateKeyItem) {
      errorMessage = `private key for "${encodedPublicKey}" already exists`;

      logger.debug(`${ThunkEnum.SaveNewAccount}: ${errorMessage}`);

      return rejectWithValue(new PrivateKeyAlreadyExistsError(errorMessage));
    }

    logger.debug(
      `${ThunkEnum.SaveNewAccount}: saving private key "${encodedPublicKey}" to storage`
    );

    try {
      // add the new private key
      privateKeyItem = await privateKeyService.setPrivateKey(
        privateKey,
        password
      );
    } catch (error) {
      logger.error(`${ThunkEnum.SaveNewAccount}: ${error.message}`);

      return rejectWithValue(error);
    }

    if (!privateKeyItem) {
      errorMessage = `failed to save private key "${encodedPublicKey}" to storage`;

      logger.debug(`${ThunkEnum.SaveNewAccount}: ${errorMessage}`);

      return rejectWithValue(new MalformedDataError(errorMessage));
    }

    logger.debug(
      `${ThunkEnum.SaveNewAccount}: successfully saved private key "${encodedPublicKey}" to storage`
    );

    account = {
      ...AccountService.initializeDefaultAccount({
        publicKey: encodedPublicKey,
        ...(privateKeyItem && {
          createdAt: privateKeyItem.createdAt,
        }),
        ...(name && {
          name,
        }),
      }),
      watchAccount: false,
    };
    accountService = new AccountService({
      logger,
    });

    // save the account to storage
    await accountService.saveAccounts([account]);

    logger.debug(
      `${ThunkEnum.SaveNewAccount}: saved account for "${encodedPublicKey}" to storage`
    );

    return account;
  }
);

export default saveNewAccountThunk;
