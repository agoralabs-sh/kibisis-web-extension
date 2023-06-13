import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

import { ASSETS_KEY_PREFIX } from '@extension/constants';

// Enums
import { AssetsThunkEnum } from '@extension/enums';

// Services
import { StorageManager } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import { IAsset, IMainRootState, INetwork } from '@extension/types';

// Utils
import { convertGenesisHashToHex } from '@extension/utils';

const fetchAssetsThunk: AsyncThunk<
  Record<string, IAsset[]>, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<
  Record<string, IAsset[]>,
  undefined,
  { state: IMainRootState }
>(AssetsThunkEnum.FetchAssets, async (_, { getState }) => {
  const logger: ILogger = getState().system.logger;
  const networks: INetwork[] = getState().networks.items;
  const storageManager: StorageManager = new StorageManager();
  const assetItems: Record<string, IAsset[]> = {};

  logger.debug(`${fetchAssetsThunk.name}: fetching assets from storage`);

  await Promise.all(
    networks.map(async (network) => {
      const encodedGenesisHash: string = convertGenesisHashToHex(
        network.genesisHash
      ); // assets are stored by a hex encoded genesis hash
      const assetsStorageKey: string = `${ASSETS_KEY_PREFIX}${encodedGenesisHash}`;
      let assets: IAsset[] | null = await storageManager.getItem<IAsset[]>(
        assetsStorageKey
      );

      // if we have no assets stored for this network, create a new entry
      if (!assets) {
        logger.debug(
          `${fetchAssetsThunk.name}: no asset entry found for "${network.genesisId}", creating an empty one`
        );

        assets = [];

        await storageManager.setItems({
          [assetsStorageKey]: assets,
        });
      }

      assetItems[encodedGenesisHash] = assets;
    })
  );

  return assetItems;
});

export default fetchAssetsThunk;
