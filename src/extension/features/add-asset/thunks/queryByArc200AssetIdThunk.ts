import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { Indexer } from 'algosdk';
import { BigNumber } from 'bignumber.js';

// constants
import {
  DEFAULT_TRANSACTION_INDEXER_LIMIT,
  NODE_REQUEST_DELAY,
} from '@extension/constants';

// enums
import { AddAssetThunkEnum } from '@extension/enums';

// errors
import { NetworkNotSelectedError, OfflineError } from '@extension/errors';

// types
import { ILogger } from '@common/types';
import {
  IAlgorandSearchApplicationsResult,
  IArc200Asset,
  INetworkWithTransactionParams,
} from '@extension/types';
import { IAssetsWithNextToken, IQueryByIdAsyncThunkConfig } from '../types';

// utils
import { getIndexerClient } from '@common/utils';
import {
  selectNetworkFromSettings,
  updateArc200AssetInformationById,
} from '@extension/utils';
import { searchAlgorandApplicationsWithDelay } from '../utils';

const queryByArc200AssetIdThunk: AsyncThunk<
  IAssetsWithNextToken<IArc200Asset>, // return
  string, // args
  IQueryByIdAsyncThunkConfig
> = createAsyncThunk<
  IAssetsWithNextToken<IArc200Asset>,
  string,
  IQueryByIdAsyncThunkConfig
>(
  AddAssetThunkEnum.QueryByArc200AssetId,
  async (query, { getState, rejectWithValue }) => {
    const currentArc200Assets: IAssetsWithNextToken<IArc200Asset> =
      getState().addAsset.arc200Assets;
    const logger: ILogger = getState().system.logger;
    const online: boolean = getState().system.online;
    const selectedNetwork: INetworkWithTransactionParams | null =
      selectNetworkFromSettings(getState().networks.items, getState().settings);
    let algorandSearchApplicationResult: IAlgorandSearchApplicationsResult;
    let indexerClient: Indexer;
    let updatedArc200Assets: IArc200Asset[] = [];

    if (!online) {
      logger.debug(
        `${AddAssetThunkEnum.QueryByArc200AssetId}: extension offline`
      );

      return rejectWithValue(
        new OfflineError(
          'attempted to query arc200 assets, but extension offline'
        )
      );
    }

    if (!selectedNetwork) {
      logger.debug(
        `${AddAssetThunkEnum.QueryByArc200AssetId}: no network selected`
      );

      return rejectWithValue(
        new NetworkNotSelectedError(
          'attempted to query arc200 assets, but no network selected'
        )
      );
    }

    indexerClient = getIndexerClient(selectedNetwork, {
      logger,
    });

    // if we have a next token, we are paginating arc200 assets
    if (currentArc200Assets.next) {
      updatedArc200Assets = currentArc200Assets.items;
    }

    try {
      algorandSearchApplicationResult =
        await searchAlgorandApplicationsWithDelay({
          appId: query,
          client: indexerClient,
          delay: 0,
          limit: DEFAULT_TRANSACTION_INDEXER_LIMIT,
          next: currentArc200Assets.next,
        });

      for (
        let index = 0;
        index < algorandSearchApplicationResult.applications.length;
        index++
      ) {
        const appId: string = new BigNumber(
          String(
            algorandSearchApplicationResult.applications[index].id as bigint
          )
        ).toString();
        const arc200Asset: IArc200Asset | null =
          await updateArc200AssetInformationById(appId, {
            delay: index * NODE_REQUEST_DELAY,
            logger,
            network: selectedNetwork,
          });

        // if the app is an arc200 app, add it to the list
        if (arc200Asset) {
          updatedArc200Assets.push(arc200Asset);
        }
      }

      // update the result
      return {
        items: updatedArc200Assets,
        next: algorandSearchApplicationResult['next-token'] || null,
      };
    } catch (error) {
      logger.debug(
        `${AddAssetThunkEnum.QueryByArc200AssetId}(): ${error.message}`
      );

      return rejectWithValue(error);
    }
  }
);

export default queryByArc200AssetIdThunk;
