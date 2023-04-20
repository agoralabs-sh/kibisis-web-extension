import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Constants
import { ASSETS_KEY_PREFIX, NODE_REQUEST_DELAY } from '@extension/constants';

// Enums
import { AssetsThunkEnum } from '@extension/enums';

// Services
import { StorageManager } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import { IAsset, IMainRootState, INetwork, INode } from '@extension/types';
import {
  IUpdateAssetInformationPayload,
  IUpdateAssetInformationResult,
} from '../types';

// Utils
import { convertGenesisHashToHex } from '@extension/utils';
import { fetchAssetInformationById, upsertAssets } from '../utils';

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
  async ({ genesisHash, ids }, { getState }) => {
    const logger: ILogger = getState().application.logger;
    const network: INetwork | null =
      getState().networks.items.find(
        (value) => value.genesisHash === genesisHash
      ) || null;
    const assets: IAsset[] = [];
    let assetInformation: IAsset;
    let assetsStorageKey: string;
    let currentAssets: IAsset[];
    let encodedGenesisHash: string;
    let id: string;
    let node: INode;
    let storageManager: StorageManager;

    if (!network) {
      logger.debug(
        `${updateAssetInformationThunk.name}: network "${genesisHash}" not found, ignoring`
      );

      return null;
    }

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
      [assetsStorageKey]: upsertAssets(currentAssets, assets),
    });

    return {
      assets,
      encodedGenesisHash,
    };
  }
);

export default updateAssetInformationThunk;
