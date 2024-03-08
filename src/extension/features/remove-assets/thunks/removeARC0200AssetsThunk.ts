import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { RemoveAssetsThunkEnum } from '@extension/enums';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IAccountInformation,
  IBaseAsyncThunkConfig,
  IMainRootState,
  INetwork,
  IUpdateARC0200AssetHoldingsPayload,
} from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

const removeARC0200AssetsThunk: AsyncThunk<
  IAccount | null, // return
  IUpdateARC0200AssetHoldingsPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IAccount | null,
  IUpdateARC0200AssetHoldingsPayload,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  RemoveAssetsThunkEnum.RemoveARC0200Assets,
  async ({ accountId, assets, genesisHash }, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const networks: INetwork[] = getState().networks.items;
    const accounts: IAccount[] = getState().accounts.items;
    let account: IAccount | null =
      accounts.find((value) => value.id === accountId) || null;
    let accountService: AccountService;
    let currentAccountInformation: IAccountInformation;
    let encodedGenesisHash: string;
    let network: INetwork | null;

    if (!account) {
      logger.debug(
        `${RemoveAssetsThunkEnum.RemoveARC0200Assets}: no account for "${accountId}" found`
      );

      return null;
    }

    network =
      networks.find((value) => value.genesisHash === genesisHash) || null;

    if (!network) {
      logger.debug(
        `${RemoveAssetsThunkEnum.RemoveARC0200Assets}: no network found for "${genesisHash}" found`
      );

      return null;
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
      `${RemoveAssetsThunkEnum.RemoveARC0200Assets}: saving account "${account.id}" to storage`
    );

    // save the account to storage
    await accountService.saveAccounts([account]);

    return account;
  }
);

export default removeARC0200AssetsThunk;
