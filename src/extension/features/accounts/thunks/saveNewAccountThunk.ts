import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { EncryptionMethodEnum } from '@extension/enums';

// errors
import { MalformedDataError } from '@extension/errors';

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

// utils
import savePrivateKeyItemWithPasskey from '@extension/utils/savePrivateKeyItemWithPasskey';
import savePrivateKeyItemWithPassword from '@extension/utils/savePrivateKeyItemWithPassword';

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
  async (
    { name, keyPair, ...encryptionOptions },
    { getState, rejectWithValue }
  ) => {
    const encodedPublicKey = PrivateKeyService.encode(keyPair.publicKey);
    const logger = getState().system.logger;
    let _error: string;
    let account: IAccountWithExtendedProps;
    let accountService: AccountService;
    let privateKeyItem: IPrivateKey | null = null;

    try {
      if (encryptionOptions.type === EncryptionMethodEnum.Passkey) {
        privateKeyItem = await savePrivateKeyItemWithPasskey({
          inputKeyMaterial: encryptionOptions.inputKeyMaterial,
          keyPair,
          logger,
        });
      }

      if (encryptionOptions.type === EncryptionMethodEnum.Password) {
        privateKeyItem = await savePrivateKeyItemWithPassword({
          keyPair,
          logger,
          password: encryptionOptions.password,
        });
      }
    } catch (error) {
      return rejectWithValue(error);
    }

    if (!privateKeyItem) {
      _error = `failed to save key "${encodedPublicKey}" (public key) to storage`;

      logger.debug(`${ThunkEnum.SaveNewAccount}: ${_error}`);

      return rejectWithValue(new MalformedDataError(_error));
    }

    logger.debug(
      `${ThunkEnum.SaveNewAccount}: successfully saved key "${encodedPublicKey}" (public key) to storage`
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
      `${ThunkEnum.SaveNewAccount}: saved account for key "${encodedPublicKey}" (public key) to storage`
    );

    return account;
  }
);

export default saveNewAccountThunk;
