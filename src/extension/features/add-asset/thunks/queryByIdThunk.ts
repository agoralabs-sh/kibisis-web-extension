import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { Algodv2, Indexer } from 'algosdk';
import { BigNumber } from 'bignumber.js';

// constants
import {
  DEFAULT_TRANSACTION_INDEXER_LIMIT,
  NODE_REQUEST_DELAY,
} from '@extension/constants';

// enums
import { AddAssetThunkEnum } from '@extension/enums';

// errors
import {
  BaseExtensionError,
  NetworkNotSelectedError,
  OfflineError,
} from '@extension/errors';

// types
import { ILogger } from '@common/types';
import {
  IAlgorandSearchApplicationsResult,
  IArc200Asset,
  IArc200AssetInformation,
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';
import {
  IAssetsWithNextToken,
  IQueryByIdAsyncThunkConfig,
  IQueryByIdResult,
} from '../types';

// utils
import { getAlgodClient, getIndexerClient } from '@common/utils';
import {
  fetchArc200AssetInformationWithDelay,
  mapArc200AssetFromArc200AssetInformation,
  selectNetworkFromSettings,
} from '@extension/utils';
import { searchAlgorandApplicationsWithDelay } from '../utils';

const queryByIdThunk: AsyncThunk<
  IQueryByIdResult, // return
  string, // args
  IQueryByIdAsyncThunkConfig
> = createAsyncThunk<IQueryByIdResult, string, IQueryByIdAsyncThunkConfig>(
  AddAssetThunkEnum.QueryById,
  async (query, { getState, rejectWithValue }) => {
    const currentArc200Assets: IAssetsWithNextToken<IArc200Asset> =
      getState().addAsset.arc200Assets;
    const logger: ILogger = getState().system.logger;
    const online: boolean = getState().system.online;
    const selectedNetwork: INetworkWithTransactionParams | null =
      selectNetworkFromSettings(getState().networks.items, getState().settings);
    let algorandSearchApplicationResult: IAlgorandSearchApplicationsResult;
    let algodClient: Algodv2;
    let indexerClient: Indexer;
    let updatedArc200Assets: IArc200Asset[] = [];

    if (!online) {
      logger.debug(`${AddAssetThunkEnum.QueryById}: extension offline`);

      return rejectWithValue(
        new OfflineError('attempted to send transaction, but extension offline')
      );
    }

    if (!selectedNetwork) {
      logger.debug(`${AddAssetThunkEnum.QueryById}: no network selected`);

      return rejectWithValue(
        new NetworkNotSelectedError(
          'attempted to send transaction, but no network selected'
        )
      );
    }

    algodClient = getAlgodClient(selectedNetwork, {
      logger,
    });
    indexerClient = getIndexerClient(selectedNetwork, {
      logger,
    });

    // if we have a next token, we are paginating
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
        const arc200Asset: IArc200AssetInformation | null =
          await fetchArc200AssetInformationWithDelay({
            algodClient,
            id: appId,
            indexerClient,
            delay: index * NODE_REQUEST_DELAY,
          });

        // if the app is an arc200 app, add it to the list
        if (arc200Asset) {
          updatedArc200Assets.push(
            mapArc200AssetFromArc200AssetInformation(
              appId,
              arc200Asset,
              null,
              false
            )
          );
        }
      }

      return {
        arc200Assets: {
          items: updatedArc200Assets,
          next: algorandSearchApplicationResult['next-token'] || null,
        },
      };
    } catch (error) {
      logger.debug(`${AddAssetThunkEnum.QueryById}(): ${error.message}`);

      return rejectWithValue(error);
    }
  }
);

export default queryByIdThunk;
