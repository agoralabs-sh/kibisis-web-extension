import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import {
  NODE_REQUEST_DELAY,
  SEARCH_ASSET_INDEXER_LIMIT,
} from '@extension/constants';

// enums
import { AddAssetThunkEnum } from '@extension/enums';

// errors
import { NetworkNotSelectedError, OfflineError } from '@extension/errors';

// models
import NetworkClient from '@extension/models/NetworkClient';

// types
import type {
  IAlgorandAsset,
  IAlgorandSearchAssetsResult,
  IStandardAsset,
  ITinyManAssetResponse,
} from '@extension/types';
import type {
  IAssetsWithNextToken,
  IQueryByIdAsyncThunkConfig,
  IQueryStandardAssetPayload,
} from '../types';

// utils
import fetchVerifiedStandardAssetList from '@extension/utils/fetchVerifiedStandardAssetList';
import mapStandardAssetFromAlgorandAsset from '@extension/utils/mapStandardAssetFromAlgorandAsset';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';
import selectNodeIDByGenesisHashFromSettings from '@extension/utils/selectNodeIDByGenesisHashFromSettings/selectNodeIDByGenesisHashFromSettings';

const queryStandardAssetThunk: AsyncThunk<
  IAssetsWithNextToken<IStandardAsset>, // return
  IQueryStandardAssetPayload, // args
  IQueryByIdAsyncThunkConfig
> = createAsyncThunk<
  IAssetsWithNextToken<IStandardAsset>,
  IQueryStandardAssetPayload,
  IQueryByIdAsyncThunkConfig
>(
  AddAssetThunkEnum.QueryStandardAsset,
  async (
    { accountId, assetId, nameOrUnit, refresh = false },
    { getState, rejectWithValue }
  ) => {
    const account =
      getState().accounts.items.find((value) => value.id === accountId) || null;
    const currentStandardAssets = getState().addAssets.standardAssets;
    const logger = getState().system.logger;
    const networks = getState().networks.items;
    const online = getState().system.networkConnectivity.online;
    const settings = getState().settings;
    const network = selectNetworkFromSettings({
      networks,
      settings,
    });
    let searchStandardAssetsResult: IAlgorandSearchAssetsResult;
    let networkClient: NetworkClient;
    let verifiedStandardAssets: ITinyManAssetResponse[];
    let updatedStandardAssets: IStandardAsset[] = [];

    if (!online) {
      logger.debug(
        `${AddAssetThunkEnum.QueryStandardAsset}: extension offline`
      );

      return rejectWithValue(
        new OfflineError(
          'attempted to query arc200 assets, but extension offline'
        )
      );
    }

    if (!account) {
      logger.debug(
        `${AddAssetThunkEnum.QueryStandardAsset}: no account found for "${accountId}"`
      );

      return currentStandardAssets;
    }

    if (!network) {
      logger.debug(
        `${AddAssetThunkEnum.QueryStandardAsset}: no network selected`
      );

      return rejectWithValue(
        new NetworkNotSelectedError(
          'attempted to send transaction, but no network selected'
        )
      );
    }

    // if we are not refreshing and there is no longer a next token, we have come to the page end
    if (!refresh && !currentStandardAssets.next) {
      return currentStandardAssets;
    }

    networkClient = new NetworkClient({ logger, network });

    try {
      searchStandardAssetsResult =
        await networkClient.searchStandardAssetsWithDelay({
          assetId,
          delay: NODE_REQUEST_DELAY,
          limit: SEARCH_ASSET_INDEXER_LIMIT,
          name: nameOrUnit,
          next: currentStandardAssets.next,
          nodeID: selectNodeIDByGenesisHashFromSettings({
            genesisHash: network.genesisHash,
            settings,
          }),
          unit: nameOrUnit,
        });
      verifiedStandardAssets = await fetchVerifiedStandardAssetList({
        logger,
        network,
      });

      for (
        let index: number = 0;
        index < searchStandardAssetsResult.assets.length;
        index++
      ) {
        const asset: IAlgorandAsset = searchStandardAssetsResult.assets[index];
        const verifiedStandardAsset: ITinyManAssetResponse | null =
          verifiedStandardAssets.find(
            (value) => value.id === String(asset.index)
          ) || null;

        // add the asset to the results
        updatedStandardAssets.push(
          mapStandardAssetFromAlgorandAsset(
            asset,
            verifiedStandardAsset?.logo.svg || null,
            !!verifiedStandardAsset
          )
        );
      }

      // update the result
      return {
        // if we are refreshing, replace all the existing assets, otherwise append
        items: refresh
          ? updatedStandardAssets
          : [...currentStandardAssets.items, ...updatedStandardAssets],
        next: searchStandardAssetsResult['next-token'] || null,
      };
    } catch (error) {
      logger.debug(
        `${AddAssetThunkEnum.QueryStandardAsset}(): ${error.message}`
      );

      return rejectWithValue(error);
    }
  }
);

export default queryStandardAssetThunk;
