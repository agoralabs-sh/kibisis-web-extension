import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// types
import { IAsset } from '@extension/types';
import { ISendAssetsState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  initialState: getInitialState(),
  name: StoreNameEnum.SendAssets,
  reducers: {
    setSelectedAsset: (
      state: Draft<ISendAssetsState>,
      action: PayloadAction<IAsset | null>
    ) => {
      state.selectedAsset = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { setSelectedAsset } = slice.actions;
