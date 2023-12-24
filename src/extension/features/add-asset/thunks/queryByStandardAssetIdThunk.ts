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
  IAccount,
  IAlgorandSearchAssetsResult,
  INetworkWithTransactionParams,
  IStandardAsset,
  IStandardAssetHolding,
} from '@extension/types';
import {
  IAssetsWithNextToken,
  IQueryByIdPayload,
  IQueryByIdAsyncThunkConfig,
} from '../types';

// utils
import { getIndexerClient } from '@common/utils';
import {
  convertGenesisHashToHex,
  selectAssetsForNetwork,
  selectNetworkFromSettings,
  updateStandardAssetInformationById,
} from '@extension/utils';
import { searchAlgorandAssetsWithDelay } from '../utils';

const queryByStandardAssetIdThunk: AsyncThunk<
  IAssetsWithNextToken<IStandardAsset>, // return
  IQueryByIdPayload, // args
  IQueryByIdAsyncThunkConfig
> = createAsyncThunk<
  IAssetsWithNextToken<IStandardAsset>,
  IQueryByIdPayload,
  IQueryByIdAsyncThunkConfig
>(
  AddAssetThunkEnum.QueryByStandardAssetId,
  async ({ accountId, query }, { getState, rejectWithValue }) => {
    const account: IAccount | null =
      getState().accounts.items.find((value) => value.id === accountId) || null;
    const currentStandardAssets: IAssetsWithNextToken<IStandardAsset> =
      getState().addAsset.standardAssets;
    const logger: ILogger = getState().system.logger;
    const online: boolean = getState().system.online;
    const selectedNetwork: INetworkWithTransactionParams | null =
      selectNetworkFromSettings(getState().networks.items, getState().settings);
    let algorandSearchAssetsResult: IAlgorandSearchAssetsResult;
    let encodedGenesisHash: string;
    let indexerClient: Indexer;
    let standardAssets: IStandardAsset[];
    let standardAssetHoldings: IStandardAssetHolding[];
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

    if (!account) {
      logger.debug(
        `${AddAssetThunkEnum.QueryByStandardAssetId}: no account found for "${accountId}"`
      );

      return currentStandardAssets;
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

    standardAssets = selectAssetsForNetwork(
      getState().standardAssets.items,
      selectedNetwork.genesisHash
    );
    standardAssetHoldings =
      account?.networkInformation[
        convertGenesisHashToHex(selectedNetwork.genesisHash).toUpperCase()
      ].standardAssetHoldings || [];
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
        delay: NODE_REQUEST_DELAY,
        limit: DEFAULT_TRANSACTION_INDEXER_LIMIT,
        name: null,
        next: currentStandardAssets.next,
        unit: null,
      });

      // filter out any assets the account already holds
      algorandSearchAssetsResult.assets =
        algorandSearchAssetsResult.assets.filter(
          (algorandAsset) =>
            !standardAssetHoldings.find(
              (value) => value.id === String(algorandAsset.index)
            )
        );

      for (
        let index = 0;
        index < algorandSearchAssetsResult.assets.length;
        index++
      ) {
        const assetId: string = new BigNumber(
          String(algorandSearchAssetsResult.assets[index].index as bigint)
        ).toString();
        let standardAsset: IStandardAsset | null =
          standardAssets.find((value) => value.id === assetId) || null;

        // if we don't have any info stored, get the asset information
        if (!standardAsset) {
          standardAsset = await updateStandardAssetInformationById(assetId, {
            delay: index * NODE_REQUEST_DELAY,
            logger,
            network: selectedNetwork,
          });
        }

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
