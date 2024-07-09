import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { encode as encodeUtf8 } from '@stablelib/utf8';
import browser from 'webextension-polyfill';

// enums
import { ThunkEnum } from '../enums';

// errors
import { InvalidPasswordError } from '@extension/errors';

// services
import AccountService from '@extension/services/AccountService';
import PasswordService from '@extension/services/PasswordService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type {
  IAccount,
  IAsyncThunkConfigWithRejectValue,
  INetwork,
  IPasswordTag,
  IPrivateKey,
  IRegistrationRootState,
} from '@extension/types';
import type { ISaveCredentialsPayload } from '../types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import initializeARC0200AssetHoldingFromARC0200Asset from '@extension/utils/initializeARC0200AssetHoldingFromARC0200Asset';
import selectDefaultNetwork from '@extension/utils/selectDefaultNetwork';

const saveCredentialsThunk: AsyncThunk<
  IAccount, // return
  ISaveCredentialsPayload, // args
  IAsyncThunkConfigWithRejectValue<IRegistrationRootState>
> = createAsyncThunk<
  IAccount,
  ISaveCredentialsPayload,
  IAsyncThunkConfigWithRejectValue<IRegistrationRootState>
>(
  ThunkEnum.SaveCredentials,
  async ({ arc0200Assets, keyPair, name }, { getState, rejectWithValue }) => {
    const logger = getState().system.logger;
    const networks = getState().networks.items;
    const password = getState().registration.password;
    let account: IAccount;
    let accountService: AccountService;
    let defaultNetwork: INetwork;
    let encodedGenesisHash: string;
    let passwordService: PasswordService;
    let passwordTagItem: IPasswordTag;
    let privateKeyItem: IPrivateKey | null;
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
        `${ThunkEnum.SaveCredentials}: saving password tag to storage`
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

      logger.debug(
        `${ThunkEnum.SaveCredentials}: saving private key to storage`
      );

      privateKeyItem = await privateKeyService.saveToStorage(
        PrivateKeyService.createPrivateKey({
          encryptedPrivateKey: await PasswordService.encryptBytes({
            data: keyPair.privateKey,
            logger,
            password,
          }),
          passwordTagId: passwordTagItem.id,
          publicKey: keyPair.publicKey,
        })
      );
    } catch (error) {
      logger.error(`${ThunkEnum.SaveCredentials}:`, error);

      // clean up, we errored
      await passwordService.removeFromStorage();
      await privateKeyService.removeAllFromStorage();

      return rejectWithValue(error);
    }

    logger.debug(
      `${ThunkEnum.SaveCredentials}: successfully saved credentials`
    );

    defaultNetwork = selectDefaultNetwork(networks);
    encodedGenesisHash = convertGenesisHashToHex(defaultNetwork.genesisHash);
    account = AccountService.initializeDefaultAccount({
      publicKey: privateKeyItem.publicKey,
      ...(privateKeyItem && {
        createdAt: privateKeyItem.createdAt,
      }),
      ...(name && {
        name,
      }),
    });
    // add any supplied arc-0200 assets
    account = {
      ...account,
      networkInformation: {
        [encodedGenesisHash]: {
          ...account.networkInformation[encodedGenesisHash],
          arc200AssetHoldings: arc0200Assets.map(
            initializeARC0200AssetHoldingFromARC0200Asset
          ),
        },
      },
    };
    accountService = new AccountService({
      logger,
    });

    // save the account to storage
    await accountService.saveAccounts([account]);

    logger.debug(
      `${ThunkEnum.SaveCredentials}: saved account for "${privateKeyItem.publicKey}" to storage`
    );

    return account;
  }
);

export default saveCredentialsThunk;
