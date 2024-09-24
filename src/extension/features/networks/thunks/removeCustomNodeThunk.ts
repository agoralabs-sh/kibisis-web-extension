import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// repositories
import NetworksRepository from '@extension/repositories/NetworksRepository';

// types
import type {
  IBaseAsyncThunkConfig,
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';
import type { IRemoveCustomNodeThunkPayload } from '../types';

const removeCustomNodeThunk: AsyncThunk<
  INetworkWithTransactionParams | null, // return
  IRemoveCustomNodeThunkPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  INetworkWithTransactionParams | null,
  IRemoveCustomNodeThunkPayload,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  ThunkEnum.RemoveCustomNodeThunk,
  async ({ genesisHash, id }, { getState }) => {
    const networks = getState().networks.items;
    const network =
      networks.find((value) => value.genesisHash === genesisHash) || null;

    if (!network) {
      return null;
    }

    return await new NetworksRepository().save({
      ...network,
      algods: network.algods.filter((value) => value.id !== id),
      indexers: network.indexers.filter((value) => value.id !== id),
    });
  }
);

export default removeCustomNodeThunk;
