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
import type { INetworkWithTransactionParams } from '@extension/types';
import type { IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** fetch transaction params from storage **/
    builder.addCase(
      fetchTransactionParamsFromStorageThunk.fulfilled,
      (
        state: IState,
        action: PayloadAction<INetworkWithTransactionParams[]>
      ) => {
        state.items = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(
      fetchTransactionParamsFromStorageThunk.pending,
      (state: IState) => {
        state.fetching = true;
      }
    );
    builder.addCase(
      fetchTransactionParamsFromStorageThunk.rejected,
      (state: IState) => {
        state.fetching = false;
      }
    );
    /** start polling for transaction params **/
    builder.addCase(
      startPollingForTransactionsParamsThunk.fulfilled,
      (state: IState, action: PayloadAction<number>) => {
        state.pollingId = action.payload;
      }
    );
    /** stop polling for transaction params **/
    builder.addCase(
      stopPollingForTransactionsParamsThunk.fulfilled,
      (state: IState) => {
        state.pollingId = null;
      }
    );
    /** update transaction params **/
    builder.addCase(
      updateTransactionParamsForSelectedNetworkThunk.fulfilled,
      (
        state: IState,
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
      (state: IState) => {
        state.updating = true;
      }
    );
    builder.addCase(
      updateTransactionParamsForSelectedNetworkThunk.rejected,
      (state: IState) => {
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
