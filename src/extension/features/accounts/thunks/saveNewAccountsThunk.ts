import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { EncryptionMethodEnum } from '@extension/enums';

// enums
import { ThunkEnum } from '../enums';

// repositories
import AccountRepositoryService from '@extension/repositories/AccountRepositoryService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type {
  IAccountWithExtendedProps,
  IAsyncThunkConfigWithRejectValue,
  IMainRootState,
  IPrivateKey,
} from '@extension/types';
import type { ISaveNewAccountsPayload } from '../types';

// utils
import savePrivateKeyItemWithPasskey from '@extension/utils/savePrivateKeyItemWithPasskey';
import savePrivateKeyItemWithPassword from '@extension/utils/savePrivateKeyItemWithPassword';
import isCredentialLockActive from '@extension/utils/isCredentialLockActive';

const saveNewAccountsThunk: AsyncThunk<
  IAccountWithExtendedProps[], // return
  ISaveNewAccountsPayload, // args
  IAsyncThunkConfigWithRejectValue<IMainRootState>
> = createAsyncThunk<
  IAccountWithExtendedProps[],
  ISaveNewAccountsPayload,
  IAsyncThunkConfigWithRejectValue<IMainRootState>
>(
  ThunkEnum.SaveNewAccounts,
  async ({ accounts, ...encryptionOptions }, { getState, rejectWithValue }) => {
    const logger = getState().system.logger;
    const { credentialLockTimeoutDuration, enableCredentialLock } =
      getState().settings.security;
    let _accounts: IAccountWithExtendedProps[] = [];
    let credentialLockActive: boolean;
    let encodedPublicKey: string;
    let privateKeyItem: IPrivateKey | null = null;
    let saveUnencryptedPrivateKey: boolean;

    credentialLockActive = await isCredentialLockActive({ logger });
    // save the unencrypted key if:
    // * the credential lock is enabled and the timeout is set to 0 ("never")
    // * the credential lock is enabled, the timeout has a duration and the credential lock is not currently active
    saveUnencryptedPrivateKey =
      (enableCredentialLock && credentialLockTimeoutDuration <= 0) ||
      (enableCredentialLock &&
        credentialLockTimeoutDuration > 0 &&
        !credentialLockActive);

    for (const { keyPair, name } of accounts) {
      encodedPublicKey = PrivateKeyService.encode(keyPair.publicKey);

      try {
        if (encryptionOptions.type === EncryptionMethodEnum.Passkey) {
          privateKeyItem = await savePrivateKeyItemWithPasskey({
            inputKeyMaterial: encryptionOptions.inputKeyMaterial,
            keyPair,
            logger,
            saveUnencryptedPrivateKey,
          });
        }

        if (encryptionOptions.type === EncryptionMethodEnum.Password) {
          privateKeyItem = await savePrivateKeyItemWithPassword({
            keyPair,
            logger,
            password: encryptionOptions.password,
            saveUnencryptedPrivateKey,
          });
        }
      } catch (error) {
        return rejectWithValue(error);
      }

      // if there is no private key, we cannot save it
      if (!privateKeyItem) {
        logger.debug(
          `${ThunkEnum.SaveNewAccounts}: unable to add account "${encodedPublicKey}" (public key), skipping`
        );

        continue;
      }

      _accounts.push({
        ...AccountRepositoryService.initializeDefaultAccount({
          publicKey: encodedPublicKey,
          ...(privateKeyItem && {
            createdAt: privateKeyItem.createdAt,
          }),
          ...(name && {
            name,
          }),
        }),
        watchAccount: false,
      });
    }

    // save the account to storage
    await new AccountRepositoryService().save(_accounts);

    logger.debug(
      `${ThunkEnum.SaveNewAccounts}: saved "${_accounts.length}" new accounts to storage`
    );

    return _accounts;
  }
);

export default saveNewAccountsThunk;
