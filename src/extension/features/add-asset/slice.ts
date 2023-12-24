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
import {
  queryByArc200AssetIdThunk,
  queryByStandardAssetIdThunk,
} from './thunks';

// types
import {
  IArc200Asset,
  IRejectedActionMeta,
  IStandardAsset,
} from '@extension/types';
import { IAddAssetState, IAssetsWithNextToken } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** query by arc200 asset id **/
    builder.addCase(
      queryByArc200AssetIdThunk.fulfilled,
      (
        state: IAddAssetState,
        action: PayloadAction<IAssetsWithNextToken<IArc200Asset>>
      ) => {
        state.arc200Assets = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(
      queryByArc200AssetIdThunk.pending,
      (state: IAddAssetState) => {
        state.fetching = true;
      }
    );
    builder.addCase(
      queryByArc200AssetIdThunk.rejected,
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
    /** query by standard asset id **/
    builder.addCase(
      queryByStandardAssetIdThunk.fulfilled,
      (
        state: IAddAssetState,
        action: PayloadAction<IAssetsWithNextToken<IStandardAsset>>
      ) => {
        state.standardAssets = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(
      queryByStandardAssetIdThunk.pending,
      (state: IAddAssetState) => {
        state.fetching = true;
      }
    );
    builder.addCase(
      queryByStandardAssetIdThunk.rejected,
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
      state.standardAssets = {
        items: [],
        next: null,
      };
    },
    reset: (state: Draft<IAddAssetState>) => {
      state.accountId = null;
      state.arc200Assets = {
        items: [],
        next: null,
      };
      state.error = null;
      state.fetching = false;
      state.selectedAsset = null;
      state.standardAssets = {
        items: [],
        next: null,
      };
    },
    setAccountId: (
      state: Draft<IAddAssetState>,
      action: PayloadAction<string | null>
    ) => {
      state.accountId = action.payload;
    },
    setError: (
      state: Draft<IAddAssetState>,
      action: PayloadAction<BaseExtensionError | null>
    ) => {
      state.error = action.payload;
    },
    setSelectedAsset: (
      state: Draft<IAddAssetState>,
      action: PayloadAction<IArc200Asset | IStandardAsset | null>
    ) => {
      state.selectedAsset = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { clearAssets, reset, setAccountId, setError, setSelectedAsset } =
  slice.actions;
