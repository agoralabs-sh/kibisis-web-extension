import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { StandardAssetsThunkEnum } from '@extension/enums';

// services
import StandardAssetService from '@extension/services/StandardAssetService';

// types
import { ILogger } from '@common/types';
import {
  IMainRootState,
  IStandardAsset,
  ITinyManAssetResponse,
} from '@extension/types';
import {
  IUpdateStandardAssetInformationPayload,
  IUpdateStandardAssetInformationResult,
} from '../types';

// utils
import fetchVerifiedStandardAssetList from '@extension/utils/fetchVerifiedStandardAssetList';
import updateStandardAssetInformationById from '@extension/utils/updateStandardAssetInformationById';
import upsertItemsById from '@extension/utils/upsertItemsById';

const updateStandardAssetInformationThunk: AsyncThunk<
  IUpdateStandardAssetInformationResult, // return
  IUpdateStandardAssetInformationPayload, // args
  Record<string, never>
> = createAsyncThunk<
  IUpdateStandardAssetInformationResult,
  IUpdateStandardAssetInformationPayload,
  { state: IMainRootState }
>(
  StandardAssetsThunkEnum.UpdateStandardAssetInformation,
  async ({ ids, network }, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const verifiedAssetList: ITinyManAssetResponse[] =
      await fetchVerifiedStandardAssetList({
        logger,
        network,
      });
    let asset: IStandardAsset | null;
    let currentAssets: IStandardAsset[];
    let id: string;
    let assetService: StandardAssetService;
    let updatedAssets: IStandardAsset[] = [];

    // get the information for each asset and add it to the array
    for (let i: number = 0; i < ids.length; i++) {
      id = ids[i];

      try {
        asset = await updateStandardAssetInformationById(id, {
          delay: i * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
          logger,
          network,
          verifiedAssetList,
        });

        if (!asset) {
          continue;
        }

        logger.debug(
          `${StandardAssetsThunkEnum.UpdateStandardAssetInformation}: successfully updated asset information for standard asset "${id}" on "${network.genesisId}"`
        );

        updatedAssets.push(asset);
      } catch (error) {
        logger.error(
          `${StandardAssetsThunkEnum.UpdateStandardAssetInformation}: failed to get asset information for standard asset "${id}" on ${network.genesisId}: ${error.message}`
        );
      }
    }

    assetService = new StandardAssetService({
      logger,
    });
    currentAssets = await assetService.getByGenesisHash(network.genesisHash);

    logger.debug(
      `${StandardAssetsThunkEnum.UpdateStandardAssetInformation}: saving new asset information for network "${network.genesisId}" to storage`
    );

    // update the storage with the new asset information
    currentAssets = await assetService.saveByGenesisHash(
      network.genesisHash,
      upsertItemsById<IStandardAsset>(currentAssets, updatedAssets)
    );

    return {
      network,
      standardAssets: currentAssets,
    };
  }
);

export default updateStandardAssetInformationThunk;
