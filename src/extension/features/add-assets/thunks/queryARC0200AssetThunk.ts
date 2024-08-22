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
  IAlgorandSearchApplicationsResult,
  IARC0200Asset,
} from '@extension/types';
import type {
  IAssetsWithNextToken,
  IQueryARC0200AssetPayload,
  IQueryByIdAsyncThunkConfig,
} from '../types';

// utils
import selectAssetsForNetwork from '@extension/utils/selectAssetsForNetwork';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';
import selectNodeIDByGenesisHashFromSettings from '@extension/utils/selectNodeIDByGenesisHashFromSettings/selectNodeIDByGenesisHashFromSettings';
import updateARC0200AssetInformationById from '@extension/utils/updateARC0200AssetInformationById';

const queryARC0200AssetThunk: AsyncThunk<
  IAssetsWithNextToken<IARC0200Asset>, // return
  IQueryARC0200AssetPayload, // args
  IQueryByIdAsyncThunkConfig
> = createAsyncThunk<
  IAssetsWithNextToken<IARC0200Asset>,
  IQueryARC0200AssetPayload,
  IQueryByIdAsyncThunkConfig
>(
  AddAssetThunkEnum.QueryARC200Asset,
  async (
    { accountId, applicationId, refresh = false },
    { getState, rejectWithValue }
  ) => {
    const account =
      getState().accounts.items.find((value) => value.id === accountId) || null;
    const currentARC200Assets = getState().addAssets.arc200Assets;
    const logger = getState().system.logger;
    const networks = getState().networks.items;
    const online = getState().system.networkConnectivity.online;
    const settings = getState().settings;
    const network = selectNetworkFromSettings({
      networks,
      settings,
    });
    let searchApplicationResult: IAlgorandSearchApplicationsResult;
    let arc200Assets: IARC0200Asset[];
    let networkClient: NetworkClient;
    let nodeID: string | null;
    let updatedARC200Assets: IARC0200Asset[] = [];

    if (!online) {
      logger.debug(`${AddAssetThunkEnum.QueryARC200Asset}: extension offline`);

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

      return currentARC200Assets;
    }

    if (!network) {
      logger.debug(
        `${AddAssetThunkEnum.QueryARC200Asset}: no network selected`
      );

      return rejectWithValue(
        new NetworkNotSelectedError(
          'attempted to query arc200 assets, but no network selected'
        )
      );
    }

    // if we are not refreshing and there is no longer a next token, we have come to the page end
    if (!refresh && !currentARC200Assets.next) {
      return currentARC200Assets;
    }

    arc200Assets = selectAssetsForNetwork(
      getState().arc0200Assets.items,
      network.genesisHash
    );
    networkClient = new NetworkClient({ logger, network });
    nodeID = selectNodeIDByGenesisHashFromSettings({
      genesisHash: network.genesisHash,
      settings,
    });

    try {
      searchApplicationResult = await networkClient.searchApplicationsWithDelay(
        {
          applicationId,
          delay: NODE_REQUEST_DELAY,
          limit: SEARCH_ASSET_INDEXER_LIMIT,
          next: currentARC200Assets.next,
          nodeID,
        }
      );

      for (
        let index = 0;
        index < searchApplicationResult.applications.length;
        index++
      ) {
        const { id } = searchApplicationResult.applications[index];
        let arc200Asset =
          arc200Assets.find((value) => value.id === String(id)) || null;

        // if we don't have any info stored, get the asset information
        if (!arc200Asset) {
          arc200Asset = await updateARC0200AssetInformationById({
            delay: index * NODE_REQUEST_DELAY,
            id: String(id),
            logger,
            network,
            nodeID,
          });
        }

        // if the app is an arc-200 app, add it to the list
        if (arc200Asset) {
          updatedARC200Assets.push(arc200Asset);
        }
      }

      // update the result
      return {
        items: refresh
          ? updatedARC200Assets
          : [...currentARC200Assets.items, ...updatedARC200Assets],
        next: searchApplicationResult['next-token'] || null,
      };
    } catch (error) {
      logger.debug(`${AddAssetThunkEnum.QueryARC200Asset}: ${error.message}`);

      return rejectWithValue(error);
    }
  }
);

export default queryARC0200AssetThunk;
