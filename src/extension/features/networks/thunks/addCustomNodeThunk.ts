import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// repositories
import NetworksRepository from '@extension/repositories/NetworksRepository';

// types
import type {
  IBaseAsyncThunkConfig,
  ICustomNode,
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';

const addCustomNodeThunk: AsyncThunk<
  INetworkWithTransactionParams | null, // return
  ICustomNode, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  INetworkWithTransactionParams | null,
  ICustomNode,
  IBaseAsyncThunkConfig<IMainRootState>
>(ThunkEnum.AddCustomNodeThunk, async (customNode, { getState }) => {
  const networks = getState().networks.items;
  const network =
    networks.find((value) => value.genesisHash === customNode.genesisHash) ||
    null;

  if (!network) {
    return null;
  }

  return await new NetworksRepository().save({
    ...network,
    ...(customNode.algod && {
      algods: [
        ...network.algods,
        {
          ...customNode.algod,
          canonicalName: customNode.name,
          id: customNode.id,
        },
      ],
    }),
    ...(customNode.indexer && {
      indexers: [
        ...network.indexers,
        {
          ...customNode.indexer,
          canonicalName: customNode.name,
          id: customNode.id,
        },
      ],
    }),
  });
});

export default addCustomNodeThunk;
