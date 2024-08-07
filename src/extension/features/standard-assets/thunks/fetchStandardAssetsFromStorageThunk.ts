import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { StandardAssetsThunkEnum } from '@extension/enums';

// services
import StandardAssetService from '@extension/services/StandardAssetService';

// types
import type {
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
  IStandardAsset,
} from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

const fetchStandardAssetsFromStorageThunk: AsyncThunk<
  Record<string, IStandardAsset[]>, // return
  undefined, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  Record<string, IStandardAsset[]>,
  undefined,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(StandardAssetsThunkEnum.FetchAssetsFromStorage, async (_, { getState }) => {
  const logger = getState().system.logger;
  const networks = getState().networks.items;
  const assetService = new StandardAssetService({
    logger,
  });
  const assetItems: Record<string, IStandardAsset[]> = {};

  logger.debug(
    `${StandardAssetsThunkEnum.FetchAssetsFromStorage}: fetching assets from storage`
  );

  await Promise.all(
    networks.map(
      async (network) =>
        (assetItems[convertGenesisHashToHex(network.genesisHash)] =
          await assetService.getByGenesisHash(network.genesisHash))
    )
  );

  return assetItems;
});

export default fetchStandardAssetsFromStorageThunk;
