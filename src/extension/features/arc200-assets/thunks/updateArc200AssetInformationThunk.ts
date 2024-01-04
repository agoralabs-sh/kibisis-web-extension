import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { Arc200AssetsThunkEnum } from '@extension/enums';

// services
import Arc200AssetService from '@extension/services/Arc200AssetService';

// types
import { ILogger } from '@common/types';
import { IArc200Asset, IMainRootState } from '@extension/types';
import {
  IUpdateArc200AssetInformationPayload,
  IUpdateArc200AssetInformationResult,
} from '../types';

// utils
import updateArc200AssetInformationById from '@extension/utils/updateArc200AssetInformationById';
import upsertItemsById from '@extension/utils/upsertItemsById';

const updateArc200AssetInformationThunk: AsyncThunk<
  IUpdateArc200AssetInformationResult, // return
  IUpdateArc200AssetInformationPayload, // args
  Record<string, never>
> = createAsyncThunk<
  IUpdateArc200AssetInformationResult,
  IUpdateArc200AssetInformationPayload,
  { state: IMainRootState }
>(
  Arc200AssetsThunkEnum.UpdateArc200AssetInformation,
  async ({ ids, network }, { getState }) => {
    const logger: ILogger = getState().system.logger;
    let asset: IArc200Asset | null;
    let currentAssets: IArc200Asset[];
    let id: string;
    let assetService: Arc200AssetService;
    let updatedAssets: IArc200Asset[] = [];

    // get the information for each asset and add it to the array
    for (let i: number = 0; i < ids.length; i++) {
      id = ids[i];

      try {
        asset = await updateArc200AssetInformationById(id, {
          delay: i * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
          logger,
          network,
        });

        if (!asset) {
          continue;
        }

        logger.debug(
          `${Arc200AssetsThunkEnum.UpdateArc200AssetInformation}: successfully updated asset information for arc200 asset "${id}" on "${network.genesisId}"`
        );

        updatedAssets.push(asset);
      } catch (error) {
        logger.error(
          `${Arc200AssetsThunkEnum.UpdateArc200AssetInformation}: failed to get asset information for arc200 asset "${id}" on ${network.genesisId}: ${error.message}`
        );
      }
    }

    assetService = new Arc200AssetService({
      logger,
    });
    currentAssets = await assetService.getByGenesisHash(network.genesisHash);

    logger.debug(
      `${Arc200AssetsThunkEnum.UpdateArc200AssetInformation}: saving new asset information for network "${network.genesisId}" to storage`
    );

    // update the storage with the new asset information
    currentAssets = await assetService.saveByGenesisHash(
      network.genesisHash,
      upsertItemsById<IArc200Asset>(currentAssets, updatedAssets)
    );

    return {
      network,
      arc200Assets: currentAssets,
    };
  }
);

export default updateArc200AssetInformationThunk;
