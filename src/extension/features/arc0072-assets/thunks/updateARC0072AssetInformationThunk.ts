import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { ARC0072AssetsThunkEnum } from '@extension/enums';

// repositories
import ARC0072AssetRepository from '@extension/repositories/ARC0072AssetRepository';

// types
import type {
  IARC0072Asset,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';
import type {
  IUpdateARC0072AssetInformationPayload,
  IUpdateARC0072AssetInformationResult,
} from '../types';

// utils
import selectNodeIDByGenesisHashFromSettings from '@extension/utils/selectNodeIDByGenesisHashFromSettings';
import updateARC0072AssetInformationById from '@extension/utils/updateARC0072AssetInformationById';
import upsertItemsById from '@extension/utils/upsertItemsById';

const updateARC0072AssetInformationThunk: AsyncThunk<
  IUpdateARC0072AssetInformationResult, // return
  IUpdateARC0072AssetInformationPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IUpdateARC0072AssetInformationResult,
  IUpdateARC0072AssetInformationPayload,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  ARC0072AssetsThunkEnum.UpdateARC0072AssetInformation,
  async ({ ids, network }, { getState }) => {
    const logger = getState().system.logger;
    const settings = getState().settings;
    let asset: IARC0072Asset | null;
    let currentAssets: IARC0072Asset[];
    let id: string;
    let repository: ARC0072AssetRepository;
    let updatedAssets: IARC0072Asset[] = [];

    // get the information for each asset and add it to the array
    for (let i: number = 0; i < ids.length; i++) {
      id = ids[i];

      try {
        asset = await updateARC0072AssetInformationById({
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
          `${ARC0072AssetsThunkEnum.UpdateARC0072AssetInformation}: successfully updated asset information for arc-0072 asset "${id}" on "${network.genesisId}"`
        );

        updatedAssets.push(asset);
      } catch (error) {
        logger.error(
          `${ARC0072AssetsThunkEnum.UpdateARC0072AssetInformation}: failed to get asset information for arc-0072 asset "${id}" on ${network.genesisId}: ${error.message}`
        );
      }
    }

    repository = new ARC0072AssetRepository();
    currentAssets = await repository.fetchByGenesisHash(network.genesisHash);

    logger.debug(
      `${ARC0072AssetsThunkEnum.UpdateARC0072AssetInformation}: saving new asset information for network "${network.genesisId}" to storage`
    );

    // update the storage with the new asset information
    await repository.saveByGenesisHash({
      genesisHash: network.genesisHash,
      items: upsertItemsById<IARC0072Asset>(currentAssets, updatedAssets),
    });

    return {
      arc0072Assets: updatedAssets,
      network,
    };
  }
);

export default updateARC0072AssetInformationThunk;
