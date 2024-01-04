import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { Indexer } from 'algosdk';

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
import { ILogger } from '@common/types';
import {
  IAccount,
  IAlgorandApplication,
  IAlgorandSearchApplicationsResult,
  IArc200Asset,
  IArc200AssetHolding,
  INetworkWithTransactionParams,
} from '@extension/types';
import {
  IAssetsWithNextToken,
  IQueryArc200AssetPayload,
  IQueryByIdAsyncThunkConfig,
} from '../types';

// utils
import getIndexerClient from '@common/utils/getIndexerClient';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import selectAssetsForNetwork from '@extension/utils/selectAssetsForNetwork';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';
import updateArc200AssetInformationById from '@extension/utils/updateArc200AssetInformationById';
import { searchAlgorandApplicationsWithDelay } from '../utils';

const queryArc200AssetThunk: AsyncThunk<
  IAssetsWithNextToken<IArc200Asset>, // return
  IQueryArc200AssetPayload, // args
  IQueryByIdAsyncThunkConfig
> = createAsyncThunk<
  IAssetsWithNextToken<IArc200Asset>,
  IQueryArc200AssetPayload,
  IQueryByIdAsyncThunkConfig
>(
  AddAssetThunkEnum.QueryArc200Asset,
  async (
    { accountId, applicationId, refresh = false },
    { getState, rejectWithValue }
  ) => {
    const account: IAccount | null =
      getState().accounts.items.find((value) => value.id === accountId) || null;
    const currentArc200Assets: IAssetsWithNextToken<IArc200Asset> =
      getState().addAsset.arc200Assets;
    const logger: ILogger = getState().system.logger;
    const online: boolean = getState().system.online;
    const selectedNetwork: INetworkWithTransactionParams | null =
      selectNetworkFromSettings(getState().networks.items, getState().settings);
    let algorandSearchApplicationResult: IAlgorandSearchApplicationsResult;
    let arc200AssetHoldings: IArc200AssetHolding[];
    let arc200Assets: IArc200Asset[];
    let filteredAlgorandApplications: IAlgorandApplication[];
    let indexerClient: Indexer;
    let updatedArc200Assets: IArc200Asset[] = [];

    if (!online) {
      logger.debug(`${AddAssetThunkEnum.QueryArc200Asset}: extension offline`);

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

      return currentArc200Assets;
    }

    if (!selectedNetwork) {
      logger.debug(
        `${AddAssetThunkEnum.QueryArc200Asset}: no network selected`
      );

      return rejectWithValue(
        new NetworkNotSelectedError(
          'attempted to query arc200 assets, but no network selected'
        )
      );
    }

    // if we are not refreshing and there is no longer a next token, we have come to the page end
    if (!refresh && !currentArc200Assets.next) {
      return currentArc200Assets;
    }

    arc200Assets = selectAssetsForNetwork(
      getState().arc200Assets.items,
      selectedNetwork.genesisHash
    );
    arc200AssetHoldings =
      account?.networkInformation[
        convertGenesisHashToHex(selectedNetwork.genesisHash).toUpperCase()
      ].arc200AssetHoldings || [];
    indexerClient = getIndexerClient(selectedNetwork, {
      logger,
    });

    try {
      algorandSearchApplicationResult =
        await searchAlgorandApplicationsWithDelay({
          applicationId,
          client: indexerClient,
          delay: NODE_REQUEST_DELAY,
          limit: SEARCH_ASSET_INDEXER_LIMIT,
          next: currentArc200Assets.next,
        });

      // filter out any assets the account already holds
      filteredAlgorandApplications =
        algorandSearchApplicationResult.applications.filter(
          (algorandApplication) =>
            !arc200AssetHoldings.find(
              (value) => value.id === String(algorandApplication.id)
            )
        );

      for (
        let index = 0;
        index < filteredAlgorandApplications.length;
        index++
      ) {
        const application: IAlgorandApplication =
          filteredAlgorandApplications[index];
        let arc200Asset: IArc200Asset | null =
          arc200Assets.find((value) => value.id === String(application.id)) ||
          null;

        // if we don't have any info stored, get the asset information
        if (!arc200Asset) {
          arc200Asset = await updateArc200AssetInformationById(
            String(application.id),
            {
              delay: index * NODE_REQUEST_DELAY,
              logger,
              network: selectedNetwork,
            }
          );
        }

        // if the app is an arc200 app, add it to the list
        if (arc200Asset) {
          updatedArc200Assets.push(arc200Asset);
        }
      }

      // update the result
      return {
        items: refresh
          ? updatedArc200Assets
          : [...currentArc200Assets.items, ...updatedArc200Assets],
        next: algorandSearchApplicationResult['next-token'] || null,
      };
    } catch (error) {
      logger.debug(`${AddAssetThunkEnum.QueryArc200Asset}(): ${error.message}`);

      return rejectWithValue(error);
    }
  }
);

export default queryArc200AssetThunk;
