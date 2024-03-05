import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ARC0200AssetsThunkEnum } from '@extension/enums';

// services
import ARC0200AssetService from '@extension/services/ARC0200AssetService';

// types
import { ILogger } from '@common/types';
import { IARC0200Asset, IMainRootState, INetwork } from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

const fetchARC0200AssetsFromStorageThunk: AsyncThunk<
  Record<string, IARC0200Asset[]>, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<
  Record<string, IARC0200Asset[]>,
  undefined,
  { state: IMainRootState }
>(
  ARC0200AssetsThunkEnum.FetchARC0200AssetsFromStorage,
  async (_, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const networks: INetwork[] = getState().networks.items;
    const assetService: ARC0200AssetService = new ARC0200AssetService({
      logger,
    });
    const assetItems: Record<string, IARC0200Asset[]> = {};

    logger.debug(
      `${ARC0200AssetsThunkEnum.FetchARC0200AssetsFromStorage}: fetching arc200 assets from storage`
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

export default fetchARC0200AssetsFromStorageThunk;
