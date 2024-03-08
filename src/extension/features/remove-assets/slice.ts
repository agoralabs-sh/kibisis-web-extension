import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import { removeARC0200AssetsThunk } from './thunks';

// types
import { IAssetTypes } from '@extension/types';
import { IInitializeRemoveAssetsPayload, IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** remove assets **/
    builder.addCase(removeARC0200AssetsThunk.fulfilled, (state: IState) => {
      state.confirming = false;
    });
    builder.addCase(removeARC0200AssetsThunk.pending, (state: IState) => {
      state.confirming = true;
    });
    builder.addCase(removeARC0200AssetsThunk.rejected, (state: IState) => {
      state.confirming = false;
    });
  },
  initialState: getInitialState(),
  name: StoreNameEnum.RemoveAssets,
  reducers: {
    initializeRemoveAssets: (
      state: Draft<IState>,
      action: PayloadAction<IInitializeRemoveAssetsPayload>
    ) => {
      state.accountId = action.payload.accountId;
      state.selectedAsset = action.payload.selectedAsset;
    },
    reset: (state: Draft<IState>) => {
      state.accountId = null;
      state.confirming = false;
      state.selectedAsset = null;
    },
    setAccountId: (
      state: Draft<IState>,
      action: PayloadAction<string | null>
    ) => {
      state.accountId = action.payload;
    },
    setConfirming: (state: Draft<IState>, action: PayloadAction<boolean>) => {
      state.confirming = action.payload;
    },
    setSelectedAsset: (
      state: Draft<IState>,
      action: PayloadAction<IAssetTypes | null>
    ) => {
      state.selectedAsset = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const {
  initializeRemoveAssets,
  reset,
  setAccountId,
  setConfirming,
  setSelectedAsset,
} = slice.actions;
