import {
  createSlice,
  Draft,
  PayloadAction,
  Reducer,
  SerializedError,
} from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// errors
import { BaseExtensionError } from '@extension/errors';

// thunks
import { queryByIdThunk } from './thunks';

// types
import { IArc200Asset, IRejectedActionMeta } from '@extension/types';
import { IAddAssetState, IQueryByIdResult } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** query by id **/
    builder.addCase(
      queryByIdThunk.fulfilled,
      (state: IAddAssetState, action: PayloadAction<IQueryByIdResult>) => {
        state.arc200Assets = action.payload.arc200Assets;
        state.fetching = false;
      }
    );
    builder.addCase(queryByIdThunk.pending, (state: IAddAssetState) => {
      state.fetching = true;
    });
    builder.addCase(
      queryByIdThunk.rejected,
      (
        state: IAddAssetState,
        action: PayloadAction<
          BaseExtensionError,
          string,
          IRejectedActionMeta,
          SerializedError
        >
      ) => {
        // if it is an abort error, ignore as it is a new request
        if (action.error.name !== 'AbortError') {
          state.error = action.payload;
          state.fetching = false;
        }
      }
    );
  },
  initialState: getInitialState(),
  name: StoreNameEnum.AddAsset,
  reducers: {
    clearAssets: (state: Draft<IAddAssetState>) => {
      state.arc200Assets = {
        items: [],
        next: null,
      };
    },
    reset: (state: Draft<IAddAssetState>) => {
      state.arc200Assets = {
        items: [],
        next: null,
      };
      state.error = null;
      state.fetching = false;
      state.selectedArc200Asset = null;
    },
    setError: (
      state: Draft<IAddAssetState>,
      action: PayloadAction<BaseExtensionError | null>
    ) => {
      state.error = action.payload;
    },
    setSelectedArc200Asset: (
      state: Draft<IAddAssetState>,
      action: PayloadAction<IArc200Asset | null>
    ) => {
      state.selectedArc200Asset = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { clearAssets, reset, setError, setSelectedArc200Asset } =
  slice.actions;
