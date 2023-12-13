import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { StandardAssetsThunkEnum } from '@extension/enums';

// services
import { StandardAssetService } from '@extension/services';

// types
import { ILogger } from '@common/types';
import { IAsset, IMainRootState, INetwork } from '@extension/types';

// utils
import { convertGenesisHashToHex } from '@extension/utils';

const fetchStandardAssetsFromStorageThunk: AsyncThunk<
  Record<string, IAsset[]>, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<
  Record<string, IAsset[]>,
  undefined,
  { state: IMainRootState }
>(StandardAssetsThunkEnum.FetchAssetsFromStorage, async (_, { getState }) => {
  const logger: ILogger = getState().system.logger;
  const networks: INetwork[] = getState().networks.items;
  const assetService: StandardAssetService = new StandardAssetService({
    logger,
  });
  const assetItems: Record<string, IAsset[]> = {};

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
