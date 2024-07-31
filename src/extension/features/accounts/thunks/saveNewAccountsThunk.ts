import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { EncryptionMethodEnum } from '@extension/enums';

// enums
import { ThunkEnum } from '../enums';

// services
import AccountService from '@extension/services/AccountService';
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
    let _accounts: IAccountWithExtendedProps[] = [];
    let encodedPublicKey: string;
    let privateKeyItem: IPrivateKey | null = null;

    for (const { keyPair, name } of accounts) {
      encodedPublicKey = PrivateKeyService.encode(keyPair.publicKey);

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

      // if there is no private key, we cannot save it
      if (!privateKeyItem) {
        logger.debug(
          `${ThunkEnum.SaveNewAccounts}: unable to add account "${encodedPublicKey}" (public key), skipping`
        );

        continue;
      }

      _accounts.push({
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
      });
    }

    // save the account to storage
    await new AccountService({
      logger,
    }).saveAccounts(_accounts);

    logger.debug(
      `${ThunkEnum.SaveNewAccounts}: saved "${_accounts.length}" new accounts to storage`
    );

    return _accounts;
  }
);

export default saveNewAccountsThunk;
