import {
  createSlice,
  Draft,
  PayloadAction,
  Reducer,
  SerializedError,
} from '@reduxjs/toolkit';

// errors
import { BaseExtensionError } from '@extension/errors';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import { submitTransactionThunk } from './thunks';

// types
import { IStandardAsset, IRejectedActionMeta } from '@extension/types';
import { IInitializeSendAssetPayload, ISendAssetsState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** submit transaction **/
    builder.addCase(
      submitTransactionThunk.fulfilled,
      (state: ISendAssetsState, action: PayloadAction<string>) => {
        state.transactionId = action.payload;
        state.confirming = false;
      }
    );
    builder.addCase(
      submitTransactionThunk.pending,
      (state: ISendAssetsState) => {
        state.confirming = true;
      }
    );
    builder.addCase(
      submitTransactionThunk.rejected,
      (
        state: ISendAssetsState,
        action: PayloadAction<
          BaseExtensionError,
          string,
          IRejectedActionMeta,
          SerializedError
        >
      ) => {
        state.error = action.payload;
        state.confirming = false;
      }
    );
  },
  initialState: getInitialState(),
  name: StoreNameEnum.SendAssets,
  reducers: {
    initializeSendAsset: (
      state: Draft<ISendAssetsState>,
      action: PayloadAction<IInitializeSendAssetPayload>
    ) => {
      state.fromAddress = action.payload.fromAddress;
      state.selectedAsset = action.payload.selectedAsset;
    },
    reset: (state: Draft<ISendAssetsState>) => {
      state.amount = '0';
      state.confirming = false;
      state.error = null;
      state.fromAddress = null;
      state.note = null;
      state.selectedAsset = null;
      state.toAddress = null;
      state.transactionId = null;
    },
    setAmount: (
      state: Draft<ISendAssetsState>,
      action: PayloadAction<string>
    ) => {
      state.amount = action.payload;
    },
    setError: (
      state: Draft<ISendAssetsState>,
      action: PayloadAction<BaseExtensionError | null>
    ) => {
      state.error = action.payload;
    },
    setFromAddress: (
      state: Draft<ISendAssetsState>,
      action: PayloadAction<string>
    ) => {
      state.fromAddress = action.payload;
    },
    setNote: (
      state: Draft<ISendAssetsState>,
      action: PayloadAction<string | null>
    ) => {
      state.note = action.payload;
    },
    setSelectedAsset: (
      state: Draft<ISendAssetsState>,
      action: PayloadAction<IStandardAsset>
    ) => {
      state.selectedAsset = action.payload;
    },
    setToAddress: (
      state: Draft<ISendAssetsState>,
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
  setError,
  setFromAddress,
  setNote,
  setSelectedAsset,
  setToAddress,
} = slice.actions;
