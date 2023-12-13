import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { StandardAssetsThunkEnum } from '@extension/enums';

// services
import { StandardAssetService } from '@extension/services';

// types
import { ILogger } from '@common/types';
import { IStandardAsset, IMainRootState } from '@extension/types';
import {
  IUpdateStandardAssetInformationPayload,
  IUpdateStandardAssetInformationResult,
} from '../types';

// utils
import { convertGenesisHashToHex, upsertItemsById } from '@extension/utils';
import { updateStandardAssetInformationById } from '../utils';

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
    let currentStandardAssets: IStandardAsset[];
    let id: string;
    let standardAssetInformation: IStandardAsset | null;
    let standardAssetService: StandardAssetService;
    let updatedStandardAssets: IStandardAsset[] = [];

    // get the information for each asset and add it to the array
    for (let i: number = 0; i < ids.length; i++) {
      id = ids[i];

      try {
        standardAssetInformation = await updateStandardAssetInformationById(
          id,
          {
            delay: i * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
            logger,
            network,
          }
        );

        if (!standardAssetInformation) {
          continue;
        }

        logger.debug(
          `${StandardAssetsThunkEnum.UpdateStandardAssetInformation}: successfully updated asset information for standard asset "${id}" on "${network.genesisId}"`
        );

        updatedStandardAssets.push(standardAssetInformation);
      } catch (error) {
        logger.error(
          `${StandardAssetsThunkEnum.UpdateStandardAssetInformation}: failed to get asset information for standard asset "${id}" on ${network.genesisId}: ${error.message}`
        );
      }
    }

    standardAssetService = new StandardAssetService({
      logger,
    });
    currentStandardAssets = await standardAssetService.getByGenesisHash(
      network.genesisHash
    );

    logger.debug(
      `${StandardAssetsThunkEnum.UpdateStandardAssetInformation}: saving new asset information for network "${network.genesisId}" to storage`
    );

    // update the storage with the new asset information
    currentStandardAssets = await standardAssetService.saveByGenesisHash(
      network.genesisHash,
      upsertItemsById<IStandardAsset>(
        currentStandardAssets,
        updatedStandardAssets
      )
    );

    return {
      network,
      standardAssets: currentStandardAssets,
    };
  }
);

export default updateStandardAssetInformationThunk;
