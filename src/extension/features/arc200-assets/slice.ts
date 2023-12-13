import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import {
  fetchArc200AssetsFromStorageThunk,
  updateArc200AssetInformationThunk,
} from './thunks';

// types
import { IArc200Asset } from '@extension/types';
import {
  IArc200AssetsState,
  IUpdateArc200AssetInformationResult,
} from './types';

// utils
import { getInitialState } from './utils';
import { convertGenesisHashToHex } from '@extension/utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** fetch arc200 assets from storage **/
    builder.addCase(
      fetchArc200AssetsFromStorageThunk.fulfilled,
      (
        state: IArc200AssetsState,
        action: PayloadAction<Record<string, IArc200Asset[]>>
      ) => {
        state.items = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(
      fetchArc200AssetsFromStorageThunk.pending,
      (state: IArc200AssetsState) => {
        state.fetching = true;
      }
    );
    builder.addCase(
      fetchArc200AssetsFromStorageThunk.rejected,
      (state: IArc200AssetsState) => {
        state.fetching = false;
      }
    );
    /** update arc200 asset information **/
    builder.addCase(
      updateArc200AssetInformationThunk.fulfilled,
      (
        state: IArc200AssetsState,
        action: PayloadAction<IUpdateArc200AssetInformationResult>
      ) => {
        state.items = {
          ...state.items,
          [convertGenesisHashToHex(
            action.payload.network.genesisHash
          ).toUpperCase()]: action.payload.arc200Assets,
        };
        state.updating = false;
      }
    );
    builder.addCase(
      updateArc200AssetInformationThunk.pending,
      (state: IArc200AssetsState) => {
        state.updating = true;
      }
    );
    builder.addCase(
      updateArc200AssetInformationThunk.rejected,
      (state: IArc200AssetsState) => {
        state.updating = false;
      }
    );
  },
  initialState: getInitialState(),
  name: StoreNameEnum.Arc200Assets,
  reducers: {
    noop: () => {
      return;
    },
  },
});

export const reducer: Reducer = slice.reducer;
