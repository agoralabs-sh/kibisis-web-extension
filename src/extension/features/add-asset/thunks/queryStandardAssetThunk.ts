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
  ITinyManAssetResponse,
} from '@extension/types';
import {
  IAssetsWithNextToken,
  IQueryByIdAsyncThunkConfig,
  IQueryStandardAssetPayload,
} from '../types';

// utils
import { getIndexerClient } from '@common/utils';
import {
  convertGenesisHashToHex,
  fetchVerifiedStandardAssetList,
  mapStandardAssetFromAlgorandAsset,
  selectNetworkFromSettings,
} from '@extension/utils';
import { searchAlgorandAssetsWithDelay } from '../utils';

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
  async ({ accountId, assetId, nameOrUnit }, { getState, rejectWithValue }) => {
    const account: IAccount | null =
      getState().accounts.items.find((value) => value.id === accountId) || null;
    const currentStandardAssets: IAssetsWithNextToken<IStandardAsset> =
      getState().addAsset.standardAssets;
    const logger: ILogger = getState().system.logger;
    const online: boolean = getState().system.online;
    const selectedNetwork: INetworkWithTransactionParams | null =
      selectNetworkFromSettings(getState().networks.items, getState().settings);
    let algorandSearchAssetsResult: IAlgorandSearchAssetsResult;
    let indexerClient: Indexer;
    let standardAssetHoldings: IStandardAssetHolding[];
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
        assetId,
        client: indexerClient,
        delay: NODE_REQUEST_DELAY,
        limit: DEFAULT_TRANSACTION_INDEXER_LIMIT,
        name: nameOrUnit,
        next: currentStandardAssets.next,
        unit: nameOrUnit,
      });

      // filter out any assets the account already holds
      algorandSearchAssetsResult.assets =
        algorandSearchAssetsResult.assets.filter(
          (algorandAsset) =>
            !standardAssetHoldings.find(
              (value) => value.id === String(algorandAsset.index)
            )
        );
      verifiedStandardAssets = await fetchVerifiedStandardAssetList({
        logger,
        network: selectedNetwork,
      });

      for (
        let index = 0;
        index < algorandSearchAssetsResult.assets.length;
        index++
      ) {
        const assetId: string = new BigNumber(
          String(algorandSearchAssetsResult.assets[index].index as bigint)
        ).toString();
        const verifiedStandardAsset: ITinyManAssetResponse | null =
          verifiedStandardAssets.find((value) => value.id === assetId) || null;

        // add the asset to the results
        updatedStandardAssets.push(
          mapStandardAssetFromAlgorandAsset(
            algorandSearchAssetsResult.assets[index],
            verifiedStandardAsset?.logo.svg || null,
            !!verifiedStandardAsset
          )
        );
      }

      // update the result
      return {
        items: updatedStandardAssets,
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
