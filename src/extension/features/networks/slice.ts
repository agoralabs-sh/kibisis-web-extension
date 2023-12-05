import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import {
  fetchTransactionParamsFromStorageThunk,
  startPollingForTransactionsParamsThunk,
  stopPollingForTransactionsParamsThunk,
  updateTransactionParamsForSelectedNetworkThunk,
} from './thunks';

// types
import { INetworkWithTransactionParams } from '@extension/types';
import { INetworksState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** fetch transaction params from storage **/
    builder.addCase(
      fetchTransactionParamsFromStorageThunk.fulfilled,
      (
        state: INetworksState,
        action: PayloadAction<INetworkWithTransactionParams[]>
      ) => {
        state.items = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(
      fetchTransactionParamsFromStorageThunk.pending,
      (state: INetworksState) => {
        state.fetching = true;
      }
    );
    builder.addCase(
      fetchTransactionParamsFromStorageThunk.rejected,
      (state: INetworksState) => {
        state.fetching = false;
      }
    );
    /** start polling for transaction params **/
    builder.addCase(
      startPollingForTransactionsParamsThunk.fulfilled,
      (state: INetworksState, action: PayloadAction<number>) => {
        state.pollingId = action.payload;
      }
    );
    /** stop polling for transaction params **/
    builder.addCase(
      stopPollingForTransactionsParamsThunk.fulfilled,
      (state: INetworksState) => {
        state.pollingId = null;
      }
    );
    /** update transaction params **/
    builder.addCase(
      updateTransactionParamsForSelectedNetworkThunk.fulfilled,
      (
        state: INetworksState,
        action: PayloadAction<INetworkWithTransactionParams | null>
      ) => {
        if (action.payload) {
          state.items = state.items.map<INetworkWithTransactionParams>(
            (value) =>
              value.genesisHash === action.payload?.genesisHash
                ? action.payload
                : value
          );
        }

        state.updating = false;
      }
    );
    builder.addCase(
      updateTransactionParamsForSelectedNetworkThunk.pending,
      (state: INetworksState) => {
        state.updating = true;
      }
    );
    builder.addCase(
      updateTransactionParamsForSelectedNetworkThunk.rejected,
      (state: INetworksState) => {
        state.updating = false;
      }
    );
  },
  initialState: getInitialState(),
  name: StoreNameEnum.Networks,
  reducers: {
    noop: () => {
      return;
    },
  },
});

export const reducer: Reducer = slice.reducer;
