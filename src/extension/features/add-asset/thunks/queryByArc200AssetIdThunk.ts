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
  IAlgorandSearchApplicationsResult,
  IArc200Asset,
  IArc200AssetHolding,
  INetworkWithTransactionParams,
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
  updateArc200AssetInformationById,
} from '@extension/utils';
import { searchAlgorandApplicationsWithDelay } from '../utils';

const queryByArc200AssetIdThunk: AsyncThunk<
  IAssetsWithNextToken<IArc200Asset>, // return
  IQueryByIdPayload, // args
  IQueryByIdAsyncThunkConfig
> = createAsyncThunk<
  IAssetsWithNextToken<IArc200Asset>,
  IQueryByIdPayload,
  IQueryByIdAsyncThunkConfig
>(
  AddAssetThunkEnum.QueryByArc200AssetId,
  async ({ accountId, query }, { getState, rejectWithValue }) => {
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

    if (!account) {
      logger.debug(
        `${AddAssetThunkEnum.QueryByStandardAssetId}: no account found for "${accountId}"`
      );

      return currentArc200Assets;
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

    // if we have a next token, we are paginating arc200 assets
    if (currentArc200Assets.next) {
      updatedArc200Assets = currentArc200Assets.items;
    }

    try {
      algorandSearchApplicationResult =
        await searchAlgorandApplicationsWithDelay({
          appId: query,
          client: indexerClient,
          delay: NODE_REQUEST_DELAY,
          limit: DEFAULT_TRANSACTION_INDEXER_LIMIT,
          next: currentArc200Assets.next,
        });

      // filter out any assets the account already holds
      algorandSearchApplicationResult.applications =
        algorandSearchApplicationResult.applications.filter(
          (algorandApplication) =>
            !arc200AssetHoldings.find(
              (value) => value.id === String(algorandApplication.id)
            )
        );

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
        let arc200Asset: IArc200Asset | null =
          arc200Assets.find((value) => value.id === appId) || null;

        // if we don't have any info stored, get the asset information
        if (!arc200Asset) {
          arc200Asset = await updateArc200AssetInformationById(appId, {
            delay: index * NODE_REQUEST_DELAY,
            logger,
            network: selectedNetwork,
          });
        }

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
