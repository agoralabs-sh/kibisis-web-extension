import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// errors
import { MalformedDataError, NetworkNotSelectedError } from '@extension/errors';

// repositories
import AccountRepositoryService from '@extension/repositories/AccountRepositoryService';

// types
import type {
  IAccountInformation,
  IARC0200Asset,
  IBaseAsyncThunkConfig,
  IMainRootState,
  INetwork,
} from '@extension/types';
import type {
  IUpdateAssetHoldingsPayload,
  IUpdateAssetHoldingsResult,
} from '../types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import isWatchAccount from '@extension/utils/isWatchAccount';
import serialize from '@extension/utils/serialize';
import { findAccountWithoutExtendedProps } from '../utils';

const removeARC0200AssetHoldingsThunk: AsyncThunk<
  IUpdateAssetHoldingsResult, // return
  IUpdateAssetHoldingsPayload<IARC0200Asset>, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IUpdateAssetHoldingsResult,
  IUpdateAssetHoldingsPayload<IARC0200Asset>,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  ThunkEnum.RemoveARC0200AssetHoldings,
  async ({ accountId, assets, genesisHash }, { getState, rejectWithValue }) => {
    const logger = getState().system.logger;
    const networks = getState().networks.items;
    const accounts = getState().accounts.items;
    let account = serialize(
      findAccountWithoutExtendedProps(accountId, accounts)
    );
    let currentAccountInformation: IAccountInformation;
    let encodedGenesisHash: string;
    let network: INetwork | null;

    if (!account) {
      logger.debug(
        `${ThunkEnum.RemoveARC0200AssetHoldings}: no account for "${accountId}" found`
      );

      return rejectWithValue(new MalformedDataError('no account found'));
    }

    network =
      networks.find((value) => value.genesisHash === genesisHash) || null;

    if (!network) {
      logger.debug(
        `${ThunkEnum.RemoveARC0200AssetHoldings}: no network found for "${genesisHash}" found`
      );

      return rejectWithValue(
        new NetworkNotSelectedError(
          `attempted to remove standard assets [${assets
            .map(({ id }) => `"${id}"`)
            .join(',')}], but network "${genesisHash}" not found`
        )
      );
    }

    encodedGenesisHash = convertGenesisHashToHex(network.genesisHash);
    currentAccountInformation =
      account.networkInformation[encodedGenesisHash] ||
      AccountRepositoryService.initializeDefaultAccountInformation();
    account.networkInformation[encodedGenesisHash] = {
      ...currentAccountInformation,
      arc200AssetHoldings: currentAccountInformation.arc200AssetHoldings.filter(
        (assetHolding) => !assets.find((value) => value.id === assetHolding.id) // filter the assets holdings that are not in the assets to be removed
      ),
    };

    logger.debug(
      `${ThunkEnum.RemoveARC0200AssetHoldings}: saving account "${account.id}" to storage`
    );

    // save the account to storage
    await new AccountRepositoryService().save([account]);

    return {
      account: {
        ...account,
        watchAccount: await isWatchAccount({ account, logger }),
      },
    };
  }
);

export default removeARC0200AssetHoldingsThunk;
