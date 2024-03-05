import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import {
  fetchARC0072AssetsFromStorageThunk,
  updateARC0072AssetInformationThunk,
} from './thunks';

// types
import type { IARC0072Asset } from '@extension/types';
import type { IState, IUpdateARC0072AssetInformationResult } from './types';

// utils
import { getInitialState } from './utils';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import upsertItemsById from '@extension/utils/upsertItemsById';

const slice = createSlice({
  extraReducers: (builder) => {
    /** fetch arc-0072 assets from storage **/
    builder.addCase(
      fetchARC0072AssetsFromStorageThunk.fulfilled,
      (
        state: IState,
        action: PayloadAction<Record<string, IARC0072Asset[]>>
      ) => {
        state.items = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(
      fetchARC0072AssetsFromStorageThunk.pending,
      (state: IState) => {
        state.fetching = true;
      }
    );
    builder.addCase(
      fetchARC0072AssetsFromStorageThunk.rejected,
      (state: IState) => {
        state.fetching = false;
      }
    );
    /** update arc-0072 asset information **/
    builder.addCase(
      updateARC0072AssetInformationThunk.fulfilled,
      (
        state: IState,
        action: PayloadAction<IUpdateARC0072AssetInformationResult>
      ) => {
        const encodedGenesisHash: string = convertGenesisHashToHex(
          action.payload.network.genesisHash
        ).toUpperCase();
        const currentARC0072Assets: IARC0072Asset[] = state.items
          ? state.items[encodedGenesisHash]
          : [];

        state.items = {
          ...state.items,
          [encodedGenesisHash]: upsertItemsById<IARC0072Asset>(
            currentARC0072Assets,
            action.payload.arc0072Assets
          ),
        };
        state.updating = false;
      }
    );
    builder.addCase(
      updateARC0072AssetInformationThunk.pending,
      (state: IState) => {
        state.updating = true;
      }
    );
    builder.addCase(
      updateARC0072AssetInformationThunk.rejected,
      (state: IState) => {
        state.updating = false;
      }
    );
  },
  initialState: getInitialState(),
  name: StoreNameEnum.ARC0072Assets,
  reducers: {
    noop: () => {
      return;
    },
  },
});

export const reducer: Reducer = slice.reducer;
