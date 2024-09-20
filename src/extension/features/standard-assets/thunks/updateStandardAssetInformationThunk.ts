import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { StandardAssetsThunkEnum } from '@extension/enums';

// repositories
import StandardAssetRepository from '@extension/repositories/StandardAssetRepository';

// types
import type {
  IBaseAsyncThunkConfig,
  IMainRootState,
  IStandardAsset,
} from '@extension/types';
import type {
  IUpdateStandardAssetInformationPayload,
  IUpdateStandardAssetInformationResult,
} from '../types';

// utils
import fetchVerifiedStandardAssetList from '@extension/utils/fetchVerifiedStandardAssetList';
import updateStandardAssetInformationById from '@extension/utils/updateStandardAssetInformationById';
import upsertItemsById from '@extension/utils/upsertItemsById';
import selectNodeIDByGenesisHashFromSettings from '@extension/utils/selectNodeIDByGenesisHashFromSettings';

const updateStandardAssetInformationThunk: AsyncThunk<
  IUpdateStandardAssetInformationResult, // return
  IUpdateStandardAssetInformationPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IUpdateStandardAssetInformationResult,
  IUpdateStandardAssetInformationPayload,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  StandardAssetsThunkEnum.UpdateStandardAssetInformation,
  async ({ ids, network }, { getState }) => {
    const logger = getState().system.logger;
    const settings = getState().settings;
    const verifiedAssetList = await fetchVerifiedStandardAssetList({
      logger,
      network,
    });
    let asset: IStandardAsset | null;
    let currentAssets: IStandardAsset[];
    let id: string;
    let repository: StandardAssetRepository;
    let updatedAssets: IStandardAsset[] = [];

    // get the information for each asset and add it to the array
    for (let i: number = 0; i < ids.length; i++) {
      id = ids[i];

      try {
        asset = await updateStandardAssetInformationById({
          delay: i * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
          id,
          logger,
          network,
          nodeID: selectNodeIDByGenesisHashFromSettings({
            genesisHash: network.genesisHash,
            settings,
          }),
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

    repository = new StandardAssetRepository();
    currentAssets = await repository.fetchByGenesisHash(network.genesisHash);

    logger.debug(
      `${StandardAssetsThunkEnum.UpdateStandardAssetInformation}: saving new asset information for network "${network.genesisId}" to storage`
    );

    // update the storage with the new asset information
    currentAssets = await repository.saveByGenesisHash({
      genesisHash: network.genesisHash,
      items: upsertItemsById<IStandardAsset>(currentAssets, updatedAssets),
    });

    return {
      network,
      standardAssets: currentAssets,
    };
  }
);

export default updateStandardAssetInformationThunk;
