import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { AccountsThunkEnum, AddAssetThunkEnum } from '@extension/enums';

// errors
import {
  DecryptionError,
  MalformedDataError,
  NetworkNotSelectedError,
  OfflineError,
} from '@extension/errors';

// services
import AccountService from '@extension/services/AccountService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IAccountInformation,
  IBaseAsyncThunkConfig,
  IMainRootState,
  INetwork,
} from '@extension/types';
import type {
  IUpdateStandardAssetHoldingsPayload,
  IUpdateStandardAssetHoldingsResult,
} from '../types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

const removeStandardAssetHoldingsThunk: AsyncThunk<
  IUpdateStandardAssetHoldingsResult, // return
  IUpdateStandardAssetHoldingsPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IUpdateStandardAssetHoldingsResult,
  IUpdateStandardAssetHoldingsPayload,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  AccountsThunkEnum.RemoveStandardAssetHoldings,
  async (
    { accountId, assets, genesisHash, password },
    { getState, rejectWithValue }
  ) => {
    const accounts: IAccount[] = getState().accounts.items;
    const logger: ILogger = getState().system.logger;
    const networks: INetwork[] = getState().networks.items;
    const online: boolean = getState().system.online;
    let account: IAccount | null =
      accounts.find((value) => value.id === accountId) || null;
    let accountService: AccountService;
    let address: string;
    let currentAccountInformation: IAccountInformation;
    let encodedGenesisHash: string;
    let errorMessage: string;
    let network: INetwork | null;
    let privateKey: Uint8Array | null;
    let privateKeyService: PrivateKeyService;

    if (!account) {
      logger.debug(
        `${AccountsThunkEnum.RemoveStandardAssetHoldings}: no account for "${accountId}" found`
      );

      return rejectWithValue(new MalformedDataError('no account found'));
    }

    if (!online) {
      logger.debug(`${AddAssetThunkEnum.AddStandardAsset}: extension offline`);

      return rejectWithValue(
        new OfflineError(
          `attempted to remove standard assets [${assets
            .map(({ id }) => `"${id}"`)
            .join(',')}], but extension offline`
        )
      );
    }

    network =
      networks.find((value) => value.genesisHash === genesisHash) || null;

    if (!network) {
      logger.debug(
        `${AccountsThunkEnum.RemoveStandardAssetHoldings}: no network found for "${genesisHash}" found`
      );

      return rejectWithValue(
        new NetworkNotSelectedError(
          `attempted to remove standard assets [${assets
            .map(({ id }) => `"${id}"`)
            .join(',')}], but network "${genesisHash}" not found`
        )
      );
    }

    privateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });
    address = AccountService.convertPublicKeyToAlgorandAddress(
      account.publicKey
    );

    try {
      privateKey = await privateKeyService.getDecryptedPrivateKey(
        AccountService.decodePublicKey(account.publicKey),
        password
      );

      if (!privateKey) {
        errorMessage = `failed to get private key for account "${address}"`;

        logger.debug(
          `${AccountsThunkEnum.RemoveStandardAssetHoldings}: ${errorMessage}`
        );

        return rejectWithValue(new DecryptionError(errorMessage));
      }
    } catch (error) {
      logger.error(`${AccountsThunkEnum.RemoveStandardAssetHoldings}:`, error);

      return rejectWithValue(error);
    }

    encodedGenesisHash = convertGenesisHashToHex(
      network.genesisHash
    ).toUpperCase();
    currentAccountInformation =
      account.networkInformation[encodedGenesisHash] ||
      AccountService.initializeDefaultAccountInformation();
    accountService = new AccountService({
      logger,
    });
    account = {
      ...account,
      networkInformation: {
        ...account.networkInformation,
        [encodedGenesisHash]: {
          ...currentAccountInformation,
          arc200AssetHoldings:
            currentAccountInformation.arc200AssetHoldings.filter(
              (assetHolding) =>
                !assets.find((value) => value.id === assetHolding.id) // filter the assets holdings that are not in the assets to be removed
            ),
        },
      },
    };

    logger.debug(
      `${AccountsThunkEnum.RemoveStandardAssetHoldings}: saving account "${account.id}" to storage`
    );

    // save the account to storage
    await accountService.saveAccounts([account]);

    return account;
  }
);

export default removeStandardAssetHoldingsThunk;
