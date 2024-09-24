import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { ARC0200AssetsThunkEnum } from '@extension/enums';

// repositories
import ARC0200AssetRepository from '@extension/repositories/ARC0200AssetRepository';

// types
import type {
  IARC0200Asset,
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';
import type {
  IUpdateARC0200AssetInformationPayload,
  IUpdateARC0200AssetInformationResult,
} from '../types';

// utils
import selectNodeIDByGenesisHashFromSettings from '@extension/utils/selectNodeIDByGenesisHashFromSettings';
import updateARC0200AssetInformationById from '@extension/utils/updateARC0200AssetInformationById';
import upsertItemsById from '@extension/utils/upsertItemsById';

const updateARC0200AssetInformationThunk: AsyncThunk<
  IUpdateARC0200AssetInformationResult, // return
  IUpdateARC0200AssetInformationPayload, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  IUpdateARC0200AssetInformationResult,
  IUpdateARC0200AssetInformationPayload,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(
  ARC0200AssetsThunkEnum.UpdateARC0200AssetInformation,
  async ({ ids, network }, { getState }) => {
    const logger = getState().system.logger;
    const settings = getState().settings;
    let asset: IARC0200Asset | null;
    let currentAssets: IARC0200Asset[];
    let id: string;
    let repository: ARC0200AssetRepository;
    let updatedAssets: IARC0200Asset[] = [];

    // get the information for each asset and add it to the array
    for (let i: number = 0; i < ids.length; i++) {
      id = ids[i];

      try {
        asset = await updateARC0200AssetInformationById({
          delay: i * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
          id,
          logger,
          network,
          nodeID: selectNodeIDByGenesisHashFromSettings({
            genesisHash: network.genesisHash,
            settings,
          }),
        });

        if (!asset) {
          continue;
        }

        logger.debug(
          `${ARC0200AssetsThunkEnum.UpdateARC0200AssetInformation}: successfully updated asset information for arc200 asset "${id}" on "${network.genesisId}"`
        );

        updatedAssets.push(asset);
      } catch (error) {
        logger.error(
          `${ARC0200AssetsThunkEnum.UpdateARC0200AssetInformation}: failed to get asset information for arc200 asset "${id}" on ${network.genesisId}: ${error.message}`
        );
      }
    }

    repository = new ARC0200AssetRepository();
    currentAssets = await repository.fetchByGenesisHash(network.genesisHash);

    logger.debug(
      `${ARC0200AssetsThunkEnum.UpdateARC0200AssetInformation}: saving new asset information for network "${network.genesisId}" to storage`
    );

    // update the storage with the new asset information
    await repository.saveByGenesisHash({
      genesisHash: network.genesisHash,
      items: upsertItemsById<IARC0200Asset>(currentAssets, updatedAssets),
    });

    return {
      network,
      arc200Assets: updatedAssets,
    };
  }
);

export default updateARC0200AssetInformationThunk;
