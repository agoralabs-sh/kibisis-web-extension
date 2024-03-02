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
  INetwork,
  IPrivateKey,
  IRegistrationRootState,
} from '@extension/types';
import type { ISaveCredentialsPayload } from '../types';

// utils
import selectDefaultNetwork from '@extension/utils/selectDefaultNetwork';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import initializeARC0200AssetHoldingFromARC0200Asset from '@extension/utils/initializeARC0200AssetHoldingFromARC0200Asset';

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
  async (
    { arc0200Assets, name, privateKey },
    { dispatch, getState, rejectWithValue }
  ) => {
    const logger: ILogger = getState().system.logger;
    const networks: INetwork[] = getState().networks.items;
    const password: string | null = getState().registration.password;
    let account: IAccount;
    let accountService: AccountService;
    let defaultNetwork: INetwork;
    let encodedGenesisHash: string;
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

    defaultNetwork = selectDefaultNetwork(networks);
    encodedGenesisHash = convertGenesisHashToHex(
      defaultNetwork.genesisHash
    ).toUpperCase();
    account = AccountService.initializeDefaultAccount({
      publicKey: encodedPublicKey,
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
      `${RegisterThunkEnum.SaveCredentials}: saved account for "${encodedPublicKey}" to storage`
    );

    return account;
  }
);

export default saveCredentialsThunk;
