import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { Arc200AssetsThunkEnum } from '@extension/enums';

// services
import Arc200AssetService from '@extension/services/Arc200AssetService';

// types
import { ILogger } from '@common/types';
import { IArc200Asset, IMainRootState, INetwork } from '@extension/types';

// utils
import { convertGenesisHashToHex } from '@extension/utils';

const fetchArc200AssetsFromStorageThunk: AsyncThunk<
  Record<string, IArc200Asset[]>, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<
  Record<string, IArc200Asset[]>,
  undefined,
  { state: IMainRootState }
>(
  Arc200AssetsThunkEnum.FetchArc200AssetsFromStorage,
  async (_, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const networks: INetwork[] = getState().networks.items;
    const assetService: Arc200AssetService = new Arc200AssetService({
      logger,
    });
    const assetItems: Record<string, IArc200Asset[]> = {};

    logger.debug(
      `${Arc200AssetsThunkEnum.FetchArc200AssetsFromStorage}: fetching arc200 assets from storage`
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
  }
);

export default fetchArc200AssetsFromStorageThunk;
