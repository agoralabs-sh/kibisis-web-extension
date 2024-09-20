import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { encode as encodeUtf8 } from '@stablelib/utf8';
import browser from 'webextension-polyfill';

// enums
import { EncryptionMethodEnum } from '@extension/enums';
import { ThunkEnum } from '../enums';

// errors
import { InvalidPasswordError } from '@extension/errors';

// repositories
import AccountRepositoryService from '@extension/repositories/AccountRepositoryService';
import PasswordService from '@extension/services/PasswordService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type {
  IAccount,
  IAsyncThunkConfigWithRejectValue,
  INewAccount,
  IPasswordTag,
  IPrivateKey,
  IRegistrationRootState,
} from '@extension/types';

const saveCredentialsThunk: AsyncThunk<
  IAccount[], // return
  INewAccount[], // args
  IAsyncThunkConfigWithRejectValue<IRegistrationRootState>
> = createAsyncThunk<
  IAccount[],
  INewAccount[],
  IAsyncThunkConfigWithRejectValue<IRegistrationRootState>
>(
  ThunkEnum.SaveCredentials,
  async (accounts, { getState, rejectWithValue }) => {
    const logger = getState().system.logger;
    const password = getState().registration.password;
    let _accounts: IAccount[] = [];
    let passwordService: PasswordService;
    let passwordTagItem: IPasswordTag;
    let privateKeyItem: IPrivateKey;
    let privateKeyItems: IPrivateKey[] = [];
    let privateKeyService: PrivateKeyService;

    if (!password) {
      logger.error(`${ThunkEnum.SaveCredentials}: no password found`);

      return rejectWithValue(new InvalidPasswordError());
    }

    passwordService = new PasswordService({
      logger,
      passwordTag: browser.runtime.id,
    });
    privateKeyService = new PrivateKeyService({
      logger,
    });

    try {
      // reset any previous keys/credentials
      await passwordService.removeFromStorage();
      await privateKeyService.removeAllFromStorage();

      logger.debug(
        `${ThunkEnum.SaveCredentials}: removed previous credentials from storage`
      );

      // save the password and the keys
      passwordTagItem = await passwordService.saveToStorage(
        PasswordService.createPasswordTag({
          encryptedTag: await PasswordService.encryptBytes({
            data: encodeUtf8(passwordService.getPasswordTag()),
            logger,
            password,
          }),
        })
      );
    } catch (error) {
      logger.error(`${ThunkEnum.SaveCredentials}:`, error);

      // clean up, we errored
      await passwordService.removeFromStorage();
      await privateKeyService.removeAllFromStorage();

      return rejectWithValue(error);
    }

    logger.debug(`${ThunkEnum.SaveCredentials}: saved password tag to storage`);

    for (const { keyPair, name } of accounts) {
      privateKeyItem = PrivateKeyService.create({
        encryptedPrivateKey: await PasswordService.encryptBytes({
          data: keyPair.privateKey,
          logger,
          password,
        }),
        encryptionID: passwordTagItem.id,
        encryptionMethod: EncryptionMethodEnum.Password,
        publicKey: keyPair.publicKey,
      });

      privateKeyItems.push(privateKeyItem);
      _accounts.push(
        AccountRepositoryService.initializeDefaultAccount({
          createdAt: privateKeyItem.createdAt,
          publicKey: privateKeyItem.publicKey,
          ...(name && {
            name,
          }),
        })
      );
    }

    // save the private keys to storage
    await privateKeyService.saveManyToStorage(privateKeyItems);

    logger.debug(
      `${ThunkEnum.SaveCredentials}: successfully saved ${privateKeyItems.length} keys to storage`
    );

    // save the accounts to storage
    await new AccountRepositoryService().save(_accounts);

    logger.debug(
      `${ThunkEnum.SaveCredentials}: successfully saved ${_accounts.length} accounts to storage`
    );

    return _accounts;
  }
);

export default saveCredentialsThunk;
