import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { encode as encodeHex } from '@stablelib/hex';
import { sign } from 'tweetnacl';
import browser from 'webextension-polyfill';

// Errors
import {
  MalformedDataError,
  PrivateKeyAlreadyExistsError,
} from '@extension/errors';

// Features
import { setError } from '@extension/features/application';

// Enums
import { AccountsThunkEnum } from '@extension/enums';

// Services
import { AccountService, PrivateKeyService } from '@extension/services';

// Types
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
    const logger: ILogger = getState().application.logger;
    const networks: INetwork[] = getState().networks.items;
    let account: IAccount;
    let accountService: AccountService;
    let encodedPublicKey: string;
    let errorMessage: string;
    let privateKeyItem: IPrivateKey | null;
    let privateKeyService: PrivateKeyService;

    try {
      logger.debug(`${saveNewAccountThunk.name}: inferring public key`);

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

        logger.debug(`${saveNewAccountThunk.name}: ${errorMessage}`);

        throw new PrivateKeyAlreadyExistsError(errorMessage);
      }

      logger.debug(
        `${saveNewAccountThunk.name}: saving private key "${encodedPublicKey}" to storage`
      );

      // add the new private key
      privateKeyItem = await privateKeyService.setPrivateKey(
        privateKey,
        password
      );

      if (!privateKeyItem) {
        errorMessage = `failed to save private key "${encodedPublicKey}" to storage`;

        logger.debug(`${saveNewAccountThunk.name}: ${errorMessage}`);

        throw new MalformedDataError(errorMessage);
      }
    } catch (error) {
      logger.error(`${saveNewAccountThunk.name}: ${error.message}`);

      dispatch(setError(error));

      throw error;
    }

    logger.debug(
      `${saveNewAccountThunk.name}: successfully saved private key "${encodedPublicKey}" to storage`
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
      `${saveNewAccountThunk.name}: saved account for "${encodedPublicKey}" to storage`
    );

    return account;
  }
);

export default saveNewAccountThunk;
