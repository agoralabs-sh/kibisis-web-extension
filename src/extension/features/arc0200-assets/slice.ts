import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import {
  fetchARC0200AssetsFromStorageThunk,
  updateARC0200AssetInformationThunk,
} from './thunks';

// types
import { IARC0200Asset } from '@extension/types';
import { IState, IUpdateARC0200AssetInformationResult } from './types';

// utils
import { getInitialState } from './utils';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import upsertItemsById from '@extension/utils/upsertItemsById';

const slice = createSlice({
  extraReducers: (builder) => {
    /** fetch arc200 assets from storage **/
    builder.addCase(
      fetchARC0200AssetsFromStorageThunk.fulfilled,
      (
        state: IState,
        action: PayloadAction<Record<string, IARC0200Asset[]>>
      ) => {
        state.items = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(
      fetchARC0200AssetsFromStorageThunk.pending,
      (state: IState) => {
        state.fetching = true;
      }
    );
    builder.addCase(
      fetchARC0200AssetsFromStorageThunk.rejected,
      (state: IState) => {
        state.fetching = false;
      }
    );
    /** update arc200 asset information **/
    builder.addCase(
      updateARC0200AssetInformationThunk.fulfilled,
      (
        state: IState,
        action: PayloadAction<IUpdateARC0200AssetInformationResult>
      ) => {
        const encodedGenesisHash: string = convertGenesisHashToHex(
          action.payload.network.genesisHash
        ).toUpperCase();
        const currentARC0200Assets: IARC0200Asset[] = state.items
          ? state.items[encodedGenesisHash]
          : [];

        state.items = {
          ...state.items,
          [encodedGenesisHash]: upsertItemsById<IARC0200Asset>(
            currentARC0200Assets,
            action.payload.arc200Assets
          ),
        };
        state.updating = false;
      }
    );
    builder.addCase(
      updateARC0200AssetInformationThunk.pending,
      (state: IState) => {
        state.updating = true;
      }
    );
    builder.addCase(
      updateARC0200AssetInformationThunk.rejected,
      (state: IState) => {
        state.updating = false;
      }
    );
  },
  initialState: getInitialState(),
  name: StoreNameEnum.ARC0200Assets,
  reducers: {
    noop: () => {
      return;
    },
  },
});

export const reducer: Reducer = slice.reducer;
