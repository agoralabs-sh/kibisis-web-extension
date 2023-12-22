import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import {
  fetchStandardAssetsFromStorageThunk,
  updateStandardAssetInformationThunk,
} from './thunks';

// types
import { IStandardAsset } from '@extension/types';
import {
  IStandardAssetsState,
  IUpdateStandardAssetInformationResult,
} from './types';

// utils
import { getInitialState } from './utils';
import { convertGenesisHashToHex } from '@extension/utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** fetch assets from storage **/
    builder.addCase(
      fetchStandardAssetsFromStorageThunk.fulfilled,
      (
        state: IStandardAssetsState,
        action: PayloadAction<Record<string, IStandardAsset[]>>
      ) => {
        state.items = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(
      fetchStandardAssetsFromStorageThunk.pending,
      (state: IStandardAssetsState) => {
        state.fetching = true;
      }
    );
    builder.addCase(
      fetchStandardAssetsFromStorageThunk.rejected,
      (state: IStandardAssetsState) => {
        state.fetching = false;
      }
    );
    /** update standard asset information **/
    builder.addCase(
      updateStandardAssetInformationThunk.fulfilled,
      (
        state: IStandardAssetsState,
        action: PayloadAction<IUpdateStandardAssetInformationResult>
      ) => {
        state.items = {
          ...state.items,
          [convertGenesisHashToHex(
            action.payload.network.genesisHash
          ).toUpperCase()]: action.payload.standardAssets,
        };
        state.updating = false;
      }
    );
    builder.addCase(
      updateStandardAssetInformationThunk.pending,
      (state: IStandardAssetsState) => {
        state.updating = true;
      }
    );
    builder.addCase(
      updateStandardAssetInformationThunk.rejected,
      (state: IStandardAssetsState) => {
        state.updating = false;
      }
    );
  },
  initialState: getInitialState(),
  name: StoreNameEnum.StandardAssets,
  reducers: {
    noop: () => {
      return;
    },
  },
});

export const reducer: Reducer = slice.reducer;
