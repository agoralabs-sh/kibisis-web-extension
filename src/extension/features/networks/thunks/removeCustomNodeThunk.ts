import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import NetworksService from '@extension/services/NetworksService';

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
    const networksService = new NetworksService();
    let network =
      networks.find((value) => value.genesisHash === genesisHash) || null;

    if (!network) {
      return null;
    }

    return await networksService.saveToStorage({
      ...network,
      algods: network.algods.filter((value) => value.id !== id),
      indexers: network.indexers.filter((value) => value.id !== id),
    });
  }
);

export default removeCustomNodeThunk;
