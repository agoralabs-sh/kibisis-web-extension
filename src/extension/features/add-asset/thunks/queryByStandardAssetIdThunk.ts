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
  IAlgorandSearchAssetsResult,
  INetworkWithTransactionParams,
  IStandardAsset,
} from '@extension/types';
import { IAssetsWithNextToken, IQueryByIdAsyncThunkConfig } from '../types';

// utils
import { getIndexerClient } from '@common/utils';
import {
  selectNetworkFromSettings,
  updateStandardAssetInformationById,
} from '@extension/utils';
import { searchAlgorandAssetsWithDelay } from '../utils';

const queryByStandardAssetIdThunk: AsyncThunk<
  IAssetsWithNextToken<IStandardAsset>, // return
  string, // args
  IQueryByIdAsyncThunkConfig
> = createAsyncThunk<
  IAssetsWithNextToken<IStandardAsset>,
  string,
  IQueryByIdAsyncThunkConfig
>(
  AddAssetThunkEnum.QueryByStandardAssetId,
  async (query, { getState, rejectWithValue }) => {
    const currentStandardAssets: IAssetsWithNextToken<IStandardAsset> =
      getState().addAsset.standardAssets;
    const logger: ILogger = getState().system.logger;
    const online: boolean = getState().system.online;
    const selectedNetwork: INetworkWithTransactionParams | null =
      selectNetworkFromSettings(getState().networks.items, getState().settings);
    let algorandSearchAssetsResult: IAlgorandSearchAssetsResult;
    let indexerClient: Indexer;
    let updatedStandardAssets: IStandardAsset[] = [];

    if (!online) {
      logger.debug(
        `${AddAssetThunkEnum.QueryByStandardAssetId}: extension offline`
      );

      return rejectWithValue(
        new OfflineError(
          'attempted to query arc200 assets, but extension offline'
        )
      );
    }

    if (!selectedNetwork) {
      logger.debug(
        `${AddAssetThunkEnum.QueryByStandardAssetId}: no network selected`
      );

      return rejectWithValue(
        new NetworkNotSelectedError(
          'attempted to send transaction, but no network selected'
        )
      );
    }

    indexerClient = getIndexerClient(selectedNetwork, {
      logger,
    });

    // if we have a next token, we are paginating the standard assets result
    if (currentStandardAssets.next) {
      updatedStandardAssets = currentStandardAssets.items;
    }

    try {
      algorandSearchAssetsResult = await searchAlgorandAssetsWithDelay({
        assetId: query,
        client: indexerClient,
        delay: 0,
        limit: DEFAULT_TRANSACTION_INDEXER_LIMIT,
        name: null,
        next: currentStandardAssets.next,
        unit: null,
      });

      for (
        let index = 0;
        index < algorandSearchAssetsResult.assets.length;
        index++
      ) {
        const assetId: string = new BigNumber(
          String(algorandSearchAssetsResult.assets[index].index as bigint)
        ).toString();
        const standardAsset: IStandardAsset | null =
          await updateStandardAssetInformationById(assetId, {
            delay: index * NODE_REQUEST_DELAY,
            logger,
            network: selectedNetwork,
          });

        // if we have the asset information, add it to the list
        if (standardAsset) {
          updatedStandardAssets.push(standardAsset);
        }
      }

      // update the result
      return {
        items: updatedStandardAssets,
        next: algorandSearchAssetsResult['next-token'] || null,
      };
    } catch (error) {
      logger.debug(
        `${AddAssetThunkEnum.QueryByStandardAssetId}(): ${error.message}`
      );

      return rejectWithValue(error);
    }
  }
);

export default queryByStandardAssetIdThunk;
