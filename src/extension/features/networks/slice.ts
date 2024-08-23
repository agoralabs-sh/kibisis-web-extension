import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import {
  addCustomNodeThunk,
  fetchFromStorageThunk,
  removeCustomNodeThunk,
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
    /** add custom node **/
    builder.addCase(
      addCustomNodeThunk.fulfilled,
      (
        state: IState,
        action: PayloadAction<INetworkWithTransactionParams | null>
      ) => {
        if (action.payload) {
          state.items = state.items.map((value) =>
            value.genesisHash === action.payload?.genesisHash
              ? action.payload
              : value
          );
        }

        state.saving = false;
      }
    );
    builder.addCase(addCustomNodeThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(addCustomNodeThunk.rejected, (state: IState) => {
      state.saving = false;
    });
    /** fetch from storage **/
    builder.addCase(
      fetchFromStorageThunk.fulfilled,
      (
        state: IState,
        action: PayloadAction<INetworkWithTransactionParams[]>
      ) => {
        state.items = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(fetchFromStorageThunk.pending, (state: IState) => {
      state.fetching = true;
    });
    builder.addCase(fetchFromStorageThunk.rejected, (state: IState) => {
      state.fetching = false;
    });
    /** remove custom node **/
    builder.addCase(
      removeCustomNodeThunk.fulfilled,
      (
        state: IState,
        action: PayloadAction<INetworkWithTransactionParams | null>
      ) => {
        if (action.payload) {
          state.items = state.items.map((value) =>
            value.genesisHash === action.payload?.genesisHash
              ? action.payload
              : value
          );
        }

        state.saving = false;
      }
    );
    builder.addCase(removeCustomNodeThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(removeCustomNodeThunk.rejected, (state: IState) => {
      state.saving = false;
    });
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
