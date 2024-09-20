import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ARC0200AssetsThunkEnum } from '@extension/enums';

// repositories
import ARC0200AssetRepository from '@extension/repositories/ARC0200AssetRepository';

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
    const assetItems: Record<string, IARC0200Asset[]> = {};

    await Promise.all(
      networks.map(
        async (network) =>
          (assetItems[
            convertGenesisHashToHex(network.genesisHash).toUpperCase()
          ] = await new ARC0200AssetRepository().fetchByGenesisHash(
            network.genesisHash
          ))
      )
    );

    logger.debug(
      `${ARC0200AssetsThunkEnum.FetchARC0200AssetsFromStorage}: fetched arc-0200 assets from storage`
    );

    return assetItems;
  }
);

export default fetchARC0200AssetsFromStorageThunk;
