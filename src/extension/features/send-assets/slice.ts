import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import {
  createUnsignedTransactionsThunk,
  submitTransactionThunk,
} from './thunks';

// types
import type {
  IAccountWithExtendedProps,
  IAssetTypes,
  INativeCurrency,
} from '@extension/types';
import type { IInitializePayload, IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** create unsigned transactions **/
    builder.addCase(
      createUnsignedTransactionsThunk.fulfilled,
      (state: IState) => {
        state.creating = false;
      }
    );
    builder.addCase(
      createUnsignedTransactionsThunk.pending,
      (state: IState) => {
        state.creating = true;
      }
    );
    builder.addCase(
      createUnsignedTransactionsThunk.rejected,
      (state: IState) => {
        state.creating = false;
      }
    );
    /** submit transaction **/
    builder.addCase(submitTransactionThunk.fulfilled, (state: IState) => {
      state.confirming = false;
    });
    builder.addCase(submitTransactionThunk.pending, (state: IState) => {
      state.confirming = true;
    });
    builder.addCase(submitTransactionThunk.rejected, (state: IState) => {
      state.confirming = false;
    });
  },
  initialState: getInitialState(),
  name: StoreNameEnum.SendAssets,
  reducers: {
    initialize: (
      state: Draft<IState>,
      action: PayloadAction<IInitializePayload>
    ) => {
      state.asset = action.payload.asset;
      state.sender = action.payload.sender;
    },
    reset: (state: Draft<IState>) => {
      state.asset = null;
      state.confirming = false;
      state.creating = false;
      state.sender = null;
    },
    setAsset: (
      state: Draft<IState>,
      action: PayloadAction<IAssetTypes | INativeCurrency | null>
    ) => {
      state.asset = action.payload;
    },
    setSender: (
      state: Draft<IState>,
      action: PayloadAction<IAccountWithExtendedProps | null>
    ) => {
      state.sender = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { initialize, reset, setAsset, setSender } = slice.actions;
