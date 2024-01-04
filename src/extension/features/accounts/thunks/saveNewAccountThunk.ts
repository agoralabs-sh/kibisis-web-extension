import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { encode as encodeHex } from '@stablelib/hex';
import { sign } from 'tweetnacl';
import browser from 'webextension-polyfill';

// errors
import {
  MalformedDataError,
  PrivateKeyAlreadyExistsError,
} from '@extension/errors';

// features
import { setError } from '@extension/features/system';

// enums
import { AccountsThunkEnum } from '@extension/enums';

// services
import AccountService from '@extension/services/AccountService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import { ILogger } from '@common/types';
import {
  IAccount,
  IMainRootState,
  INetwork,
  IPrivateKey,
} from '@extension/types';
import { ISaveNewAccountPayload } from '../types';

const saveNewAccountThunk: AsyncThunk<
  IAccount, // return
  ISaveNewAccountPayload, // args
  Record<string, never>
> = createAsyncThunk<
  IAccount,
  ISaveNewAccountPayload,
  { state: IMainRootState }
>(
  AccountsThunkEnum.SaveNewAccount,
  async ({ name, password, privateKey }, { dispatch, getState }) => {
    const logger: ILogger = getState().system.logger;
    const networks: INetwork[] = getState().networks.items;
    let account: IAccount;
    let accountService: AccountService;
    let encodedPublicKey: string;
    let errorMessage: string;
    let privateKeyItem: IPrivateKey | null;
    let privateKeyService: PrivateKeyService;

    try {
      logger.debug(`${AccountsThunkEnum.SaveNewAccount}: inferring public key`);

      encodedPublicKey = encodeHex(
        sign.keyPair.fromSecretKey(privateKey).publicKey
      ).toUpperCase();
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

        throw new PrivateKeyAlreadyExistsError(errorMessage);
      }

      logger.debug(
        `${AccountsThunkEnum.SaveNewAccount}: saving private key "${encodedPublicKey}" to storage`
      );

      // add the new private key
      privateKeyItem = await privateKeyService.setPrivateKey(
        privateKey,
        password
      );

      if (!privateKeyItem) {
        errorMessage = `failed to save private key "${encodedPublicKey}" to storage`;

        logger.debug(`${AccountsThunkEnum.SaveNewAccount}: ${errorMessage}`);

        throw new MalformedDataError(errorMessage);
      }
    } catch (error) {
      logger.error(`${AccountsThunkEnum.SaveNewAccount}: ${error.message}`);

      dispatch(setError(error));

      throw error;
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
