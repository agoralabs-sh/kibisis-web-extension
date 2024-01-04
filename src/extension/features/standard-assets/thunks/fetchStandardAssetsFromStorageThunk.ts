import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { StandardAssetsThunkEnum } from '@extension/enums';

// services
import StandardAssetService from '@extension/services/StandardAssetService';

// types
import { ILogger } from '@common/types';
import { IStandardAsset, IMainRootState, INetwork } from '@extension/types';

// utils
import { convertGenesisHashToHex } from '@extension/utils';

const fetchStandardAssetsFromStorageThunk: AsyncThunk<
  Record<string, IStandardAsset[]>, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<
  Record<string, IStandardAsset[]>,
  undefined,
  { state: IMainRootState }
>(StandardAssetsThunkEnum.FetchAssetsFromStorage, async (_, { getState }) => {
  const logger: ILogger = getState().system.logger;
  const networks: INetwork[] = getState().networks.items;
  const assetService: StandardAssetService = new StandardAssetService({
    logger,
  });
  const assetItems: Record<string, IStandardAsset[]> = {};

  logger.debug(
    `${StandardAssetsThunkEnum.FetchAssetsFromStorage}: fetching assets from storage`
  );

  await Promise.all(
    networks.map(
      async (network) =>
        (assetItems[
          convertGenesisHashToHex(network.genesisHash).toUpperCase()
        ] = await assetService.getByGenesisHash(network.genesisHash))
    )
  );

  return assetItems;
});

export default fetchStandardAssetsFromStorageThunk;
