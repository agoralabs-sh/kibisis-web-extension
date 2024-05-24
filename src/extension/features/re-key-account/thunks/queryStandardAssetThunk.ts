import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import type { Indexer } from 'algosdk';

// constants
import {
  NODE_REQUEST_DELAY,
  SEARCH_ASSET_INDEXER_LIMIT,
} from '@extension/constants';

// enums
import { AddAssetThunkEnum } from '@extension/enums';

// errors
import { NetworkNotSelectedError, OfflineError } from '@extension/errors';

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
import getIndexerClient from '@common/utils/getIndexerClient';
import fetchVerifiedStandardAssetList from '@extension/utils/fetchVerifiedStandardAssetList';
import mapStandardAssetFromAlgorandAsset from '@extension/utils/mapStandardAssetFromAlgorandAsset';
import searchAlgorandAssetsWithDelay from '@extension/utils/searchAlgorandAssetsWithDelay';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';

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
    const online = getState().system.online;
    const selectedNetwork = selectNetworkFromSettings(
      getState().networks.items,
      getState().settings
    );
    let algorandSearchAssetsResult: IAlgorandSearchAssetsResult;
    let indexerClient: Indexer;
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

    if (!selectedNetwork) {
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

    indexerClient = getIndexerClient(selectedNetwork, {
      logger,
    });

    try {
      algorandSearchAssetsResult = await searchAlgorandAssetsWithDelay({
        assetId,
        client: indexerClient,
        delay: NODE_REQUEST_DELAY,
        limit: SEARCH_ASSET_INDEXER_LIMIT,
        name: nameOrUnit,
        next: currentStandardAssets.next,
        unit: nameOrUnit,
      });
      verifiedStandardAssets = await fetchVerifiedStandardAssetList({
        logger,
        network: selectedNetwork,
      });

      for (
        let index: number = 0;
        index < algorandSearchAssetsResult.assets.length;
        index++
      ) {
        const asset: IAlgorandAsset = algorandSearchAssetsResult.assets[index];
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
        next: algorandSearchAssetsResult['next-token'] || null,
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
