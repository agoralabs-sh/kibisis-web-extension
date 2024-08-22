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
  INetworkWithTransactionParams[], // return
  IRemoveCustomNodeThunkPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  INetworkWithTransactionParams[],
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
      return networks;
    }

    network = await networksService.save({
      ...network,
      algods: network.algods.filter((value) => value.id !== id),
      indexers: network.indexers.filter((value) => value.id !== id),
    });

    return networks.map((value) =>
      value.genesisHash === network?.genesisHash ? network : value
    );
  }
);

export default removeCustomNodeThunk;
