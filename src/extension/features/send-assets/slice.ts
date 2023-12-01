import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// types
import { IAsset } from '@extension/types';
import { IInitializeSendAssetPayload, ISendAssetsState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
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
      state.fromAddress = null;
      state.selectedAsset = null;
    },
    setSelectedAsset: (
      state: Draft<ISendAssetsState>,
      action: PayloadAction<IAsset>
    ) => {
      state.selectedAsset = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { initializeSendAsset, reset, setSelectedAsset } = slice.actions;
