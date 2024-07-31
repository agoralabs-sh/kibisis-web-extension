import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ARC0200AssetsThunkEnum } from '@extension/enums';

// services
import ARC0200AssetService from '@extension/services/ARC0200AssetService';

// types
import type {
  IARC0200Asset,
  IBaseAsyncThunkConfig,
  IMainRootState,
  IRegistrationRootState,
} from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

const fetchARC0200AssetsFromStorageThunk: AsyncThunk<
  Record<string, IARC0200Asset[]>, // return
  undefined, // args
  IBaseAsyncThunkConfig<IMainRootState | IRegistrationRootState>
> = createAsyncThunk<
  Record<string, IARC0200Asset[]>,
  undefined,
  IBaseAsyncThunkConfig<IMainRootState | IRegistrationRootState>
>(
  ARC0200AssetsThunkEnum.FetchARC0200AssetsFromStorage,
  async (_, { getState }) => {
    const logger = getState().system.logger;
    const networks = getState().networks.items;
    const assetService = new ARC0200AssetService({
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
