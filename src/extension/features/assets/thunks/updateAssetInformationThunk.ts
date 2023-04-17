import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { Algodv2 } from 'algosdk';

// Constants
import { ASSETS_KEY_PREFIX, NODE_REQUEST_DELAY } from '@extension/constants';

// Enums
import { AssetsThunkEnum } from '@extension/enums';

// Services
import { StorageManager } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import {
  IAlgorandAsset,
  IAsset,
  IMainRootState,
  INetwork,
  INode,
  ITinyManAssetResponse,
} from '@extension/types';
import {
  IUpdateAssetInformationPayload,
  IUpdateAssetInformationResult,
} from '../types';

// Utils
import {
  convertGenesisHashToHex,
  fetchAssetList,
  fetchAssetVerification,
  mapAssetFromAlgorandAsset,
  randomNode,
} from '@extension/utils';
import { fetchAssetInformationWithDelay, upsertAssets } from '../utils';

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
    let assetInformation: IAlgorandAsset;
    let assetList: Record<string, ITinyManAssetResponse> | null = null;
    let assetsStorageKey: string;
    let client: Algodv2;
    let currentAssets: IAsset[];
    let delay: number;
    let encodedGenesisHash: string;
    let id: string;
    let node: INode;
    let storageManager: StorageManager;
    let verified: boolean;

    if (!network) {
      logger.debug(
        `${updateAssetInformationThunk.name}: network "${genesisHash}" not found, ignoring`
      );

      return null;
    }

    // TODO: asset list only exists for algorand mainnet, move this url to config?
    if (
      network.genesisHash === 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8='
    ) {
      assetList = await fetchAssetList({
        logger,
      });
    }

    // get the information for each asset and add it to the array
    for (let i: number = 0; i < ids.length; i++) {
      id = ids[i];
      node = randomNode(network);
      client = new Algodv2('', node.url, node.port);
      delay = i * NODE_REQUEST_DELAY; // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
      verified = false;

      try {
        assetInformation = await fetchAssetInformationWithDelay({
          client,
          delay,
          id,
        });

        logger.debug(
          `${updateAssetInformationThunk.name}: getting verified status for "${id}" from "${node.name}" on "${network.genesisId}"`
        );

        // TODO: asset list only exists for algorand mainnet, move this url to config?
        if (
          network.genesisHash === 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8='
        ) {
          verified = await fetchAssetVerification(id, {
            delay,
            logger,
          });
        }

        assets.push(
          mapAssetFromAlgorandAsset(
            assetInformation,
            assetList ? assetList[id]?.logo.svg || null : null,
            verified
          )
        );

        logger.debug(
          `${updateAssetInformationThunk.name}: successfully updated asset information for "${id}" from "${node.name}" on "${network.genesisId}"`
        );
      } catch (error) {
        logger.error(
          `${updateAssetInformationThunk.name}: failed to get asset information for asset "${id}" from "${node.name}" on ${network.genesisId}: ${error.message}`
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
