import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ARC0072AssetsThunkEnum } from '@extension/enums';

// services
import ARC0072AssetService from '@extension/services/ARC0072AssetService';

// types
import type { ILogger } from '@common/types';
import type {
  IARC0072Asset,
  IBaseAsyncThunkConfig,
  INetwork,
} from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

const fetchARC0072AssetsFromStorageThunk: AsyncThunk<
  Record<string, IARC0072Asset[]>, // return
  undefined, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<
  Record<string, IARC0072Asset[]>,
  undefined,
  IBaseAsyncThunkConfig
>(
  ARC0072AssetsThunkEnum.FetchARC0072AssetsFromStorage,
  async (_, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const networks: INetwork[] = getState().networks.items;
    const assetService: ARC0072AssetService = new ARC0072AssetService({
      logger,
    });
    const assetItems: Record<string, IARC0072Asset[]> = {};

    logger.debug(
      `${ARC0072AssetsThunkEnum.FetchARC0072AssetsFromStorage}: fetching arc-0072 assets from storage`
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

export default fetchARC0072AssetsFromStorageThunk;
