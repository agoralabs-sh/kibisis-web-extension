import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// configs
import { networks as defaultNetworks } from '@extension/config';

// enums
import { ThunkEnum } from '../enums';

// services
import NetworksService from '@extension/services/NetworksService';

// types
import type {
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';

const fetchFromStorageThunk: AsyncThunk<
  INetworkWithTransactionParams[], // return
  undefined, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  INetworkWithTransactionParams[],
  undefined,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(ThunkEnum.FetchFromStorageThunk, async (_, { getState }) => {
  const networksService = new NetworksService();
  const networks: INetworkWithTransactionParams[] =
    await networksService.getAll();

  // use the networks in the default storage as the source of truth, but add an default networks
  return defaultNetworks.map((value) => {
    const network =
      networks.find((_value) => _value.genesisHash === value.genesisHash) ||
      null;

    return NetworksService.mapWithDefaultTransactionParams(network || value);
  });
});

export default fetchFromStorageThunk;
