import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// configs
import { networks as defaultNetworks } from '@extension/config';

// enums
import { ThunkEnum } from '../enums';

// repositories
import NetworksRepository from '@extension/repositories/NetworksRepository';

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
>(ThunkEnum.FetchFromStorageThunk, async () => {
  const networks = await new NetworksRepository().fetchAll();

  // use the networks in the config as the source of truth, but add any custom networks in storage
  return defaultNetworks.map((value) => {
    const network =
      networks.find((_value) => _value.genesisHash === value.genesisHash) ||
      null;

    return NetworksRepository.mapWithDefaultTransactionParams(network || value);
  });
});

export default fetchFromStorageThunk;
