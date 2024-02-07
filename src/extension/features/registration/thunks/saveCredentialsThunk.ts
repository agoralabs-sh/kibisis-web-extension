import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { encode as encodeHex } from '@stablelib/hex';
import { sign } from 'tweetnacl';
import browser from 'webextension-polyfill';

// enums
import { RegisterThunkEnum } from '@extension/enums';

// errors
import { InvalidPasswordError } from '@extension/errors';

// services
import AccountService from '@extension/services/AccountService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IAsyncThunkConfigWithRejectValue,
  IPrivateKey,
  IRegistrationRootState,
} from '@extension/types';
import type { ISaveCredentialsPayload } from '../types';

const saveCredentialsThunk: AsyncThunk<
  IAccount, // return
  ISaveCredentialsPayload, // args
  IAsyncThunkConfigWithRejectValue<IRegistrationRootState>
> = createAsyncThunk<
  IAccount,
  ISaveCredentialsPayload,
  IAsyncThunkConfigWithRejectValue<IRegistrationRootState>
>(
  RegisterThunkEnum.SaveCredentials,
  async ({ name, privateKey }, { dispatch, getState, rejectWithValue }) => {
    const logger: ILogger = getState().system.logger;
    const password: string | null = getState().registration.password;
    let account: IAccount;
    let accountService: AccountService;
    let encodedPublicKey: string;
    let privateKeyItem: IPrivateKey | null;
    let privateKeyService: PrivateKeyService;

    if (!password) {
      logger.error(`${RegisterThunkEnum.SaveCredentials}: no password found`);

      return rejectWithValue(new InvalidPasswordError());
    }

    try {
      logger.debug(
        `${RegisterThunkEnum.SaveCredentials}: inferring public key`
      );

      encodedPublicKey = encodeHex(
        sign.keyPair.fromSecretKey(privateKey).publicKey
      );
      privateKeyService = new PrivateKeyService({
        logger,
        passwordTag: browser.runtime.id,
      });

      logger.debug(
        `${RegisterThunkEnum.SaveCredentials}: saving private key, with encoded public key "${encodedPublicKey}", to storage`
      );

      // reset any previous credentials, set the password and the account
      await privateKeyService.reset();
      await privateKeyService.setPassword(password);

      privateKeyItem = await privateKeyService.setPrivateKey(
        privateKey,
        password
      );
    } catch (error) {
      logger.error(`${RegisterThunkEnum.SaveCredentials}: ${error.message}`);

      return rejectWithValue(error);
    }

    logger.debug(
      `${RegisterThunkEnum.SaveCredentials}: successfully saved credentials`
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
      `${RegisterThunkEnum.SaveCredentials}: saved account for "${encodedPublicKey}" to storage`
    );

    return account;
  }
);

export default saveCredentialsThunk;
