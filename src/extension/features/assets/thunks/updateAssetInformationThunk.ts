import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { ASSETS_KEY_PREFIX, NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { AssetsThunkEnum } from '@extension/enums';

// servcies
import { StorageManager } from '@extension/services';

// types
import { ILogger } from '@common/types';
import { IAsset, IMainRootState } from '@extension/types';
import {
  IUpdateAssetInformationPayload,
  IUpdateAssetInformationResult,
} from '../types';

// utils
import { convertGenesisHashToHex, upsertItemsById } from '@extension/utils';
import { fetchAssetInformationById } from '../utils';

const updateAssetInformationThunk: AsyncThunk<
  IUpdateAssetInformationResult | null, // return
  IUpdateAssetInformationPayload, // args
  Record<string, never>
> = createAsyncThunk<
  IUpdateAssetInformationResult | null,
  IUpdateAssetInformationPayload,
  { state: IMainRootState }
>(
  AssetsThunkEnum.UpdateAssetInformation,
  async ({ ids, network }, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const assets: IAsset[] = [];
    let assetInformation: IAsset | null;
    let assetsStorageKey: string;
    let currentAssets: IAsset[];
    let encodedGenesisHash: string;
    let id: string;
    let storageManager: StorageManager;

    // get the information for each asset and add it to the array
    for (let i: number = 0; i < ids.length; i++) {
      id = ids[i];

      try {
        assetInformation = await fetchAssetInformationById(id, {
          delay: i * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
          logger,
          network,
        });

        if (!assetInformation) {
          continue;
        }

        logger.debug(
          `${updateAssetInformationThunk.name}: successfully updated asset information for "${id}" on "${network.genesisId}"`
        );

        assets.push(assetInformation);
      } catch (error) {
        logger.error(
          `${updateAssetInformationThunk.name}: failed to get asset information for asset "${id}" on ${network.genesisId}: ${error.message}`
        );
      }
    }

    storageManager = new StorageManager();
    encodedGenesisHash = convertGenesisHashToHex(network.genesisHash);
    assetsStorageKey = `${ASSETS_KEY_PREFIX}${encodedGenesisHash}`;
    currentAssets =
      (await storageManager.getItem<IAsset[]>(assetsStorageKey)) || []; // get the current assets from storage

    logger.debug(
      `${updateAssetInformationThunk.name}: saving new asset information for network "${network.genesisId}" to storage`
    );

    // update the storage with the new asset information
    await storageManager.setItems({
      [assetsStorageKey]: upsertItemsById<IAsset>(currentAssets, assets),
    });

    return {
      assets,
      encodedGenesisHash,
    };
  }
);

export default updateAssetInformationThunk;
