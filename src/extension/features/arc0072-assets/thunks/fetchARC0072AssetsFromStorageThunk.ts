import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ARC0072AssetsThunkEnum } from '@extension/enums';

// repositories
import ARC0072AssetRepository from '@extension/repositories/ARC0072AssetRepository';

// types
import type { ILogger } from '@common/types';
import type {
  IARC0072Asset,
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
  INetwork,
} from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

const fetchARC0072AssetsFromStorageThunk: AsyncThunk<
  Record<string, IARC0072Asset[]>, // return
  undefined, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  Record<string, IARC0072Asset[]>,
  undefined,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(
  ARC0072AssetsThunkEnum.FetchARC0072AssetsFromStorage,
  async (_, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const networks: INetwork[] = getState().networks.items;
    const assetItems: Record<string, IARC0072Asset[]> = {};

    logger.debug(
      `${ARC0072AssetsThunkEnum.FetchARC0072AssetsFromStorage}: fetching arc-0072 assets from storage`
    );

    await Promise.all(
      networks.map(
        async (network) =>
          (assetItems[convertGenesisHashToHex(network.genesisHash)] =
            await new ARC0072AssetRepository().fetchByGenesisHash(
              network.genesisHash
            ))
      )
    );

    return assetItems;
  }
);

export default fetchARC0072AssetsFromStorageThunk;
