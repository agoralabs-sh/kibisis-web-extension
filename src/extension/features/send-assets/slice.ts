import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import {
  createUnsignedTransactionsThunk,
  submitTransactionThunk,
} from './thunks';

// types
import type { IAssetTypes, INativeCurrency } from '@extension/types';
import type { IInitializeSendAssetPayload, IState } from './types';

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
    initializeSendAsset: (
      state: Draft<IState>,
      action: PayloadAction<IInitializeSendAssetPayload>
    ) => {
      state.fromAddress = action.payload.fromAddress;
      state.selectedAsset = action.payload.selectedAsset;
    },
    reset: (state: Draft<IState>) => {
      state.amountInStandardUnits = '0';
      state.confirming = false;
      state.creating = false;
      state.fromAddress = null;
      state.note = null;
      state.selectedAsset = null;
      state.toAddress = null;
    },
    setAmount: (state: Draft<IState>, action: PayloadAction<string>) => {
      state.amountInStandardUnits = action.payload;
    },
    setFromAddress: (state: Draft<IState>, action: PayloadAction<string>) => {
      state.fromAddress = action.payload;
    },
    setNote: (state: Draft<IState>, action: PayloadAction<string | null>) => {
      state.note = action.payload;
    },
    setSelectedAsset: (
      state: Draft<IState>,
      action: PayloadAction<IAssetTypes | INativeCurrency>
    ) => {
      state.selectedAsset = action.payload;
    },
    setToAddress: (
      state: Draft<IState>,
      action: PayloadAction<string | null>
    ) => {
      state.toAddress = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const {
  initializeSendAsset,
  reset,
  setAmount,
  setFromAddress,
  setNote,
  setSelectedAsset,
  setToAddress,
} = slice.actions;
