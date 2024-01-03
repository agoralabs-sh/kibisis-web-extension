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
  addStandardAssetThunk,
  queryArc200AssetThunk,
  queryStandardAssetThunk,
} from './thunks';

// types
import {
  IArc200Asset,
  IAssetTypes,
  IRejectedActionMeta,
  IStandardAsset,
} from '@extension/types';
import {
  IAddAssetState,
  IAssetsWithNextToken,
  IQueryArc200AssetPayload,
  IQueryStandardAssetPayload,
} from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** add standard asset **/
    builder.addCase(
      addStandardAssetThunk.fulfilled,
      (state: IAddAssetState, action: PayloadAction<string | null>) => {
        state.confirming = false;
      }
    );
    builder.addCase(addStandardAssetThunk.pending, (state: IAddAssetState) => {
      state.confirming = true;
    });
    builder.addCase(addStandardAssetThunk.rejected, (state: IAddAssetState) => {
      state.confirming = false;
    });
    /** query arc200 asset **/
    builder.addCase(
      queryArc200AssetThunk.fulfilled,
      (
        state: IAddAssetState,
        action: PayloadAction<IAssetsWithNextToken<IArc200Asset>>
      ) => {
        state.arc200Assets = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(queryArc200AssetThunk.pending, (state: IAddAssetState) => {
      state.fetching = true;
    });
    builder.addCase(
      queryArc200AssetThunk.rejected,
      (
        state: IAddAssetState,
        action: PayloadAction<
          BaseExtensionError,
          string,
          IRejectedActionMeta<IQueryArc200AssetPayload>,
          SerializedError
        >
      ) => {
        // if it is an abort error, ignore as it is a new request
        if (action.error.name !== 'AbortError') {
          state.fetching = false;
        }
      }
    );
    /** query standard asset **/
    builder.addCase(
      queryStandardAssetThunk.fulfilled,
      (
        state: IAddAssetState,
        action: PayloadAction<IAssetsWithNextToken<IStandardAsset>>
      ) => {
        state.standardAssets = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(
      queryStandardAssetThunk.pending,
      (state: IAddAssetState) => {
        state.fetching = true;
      }
    );
    builder.addCase(
      queryStandardAssetThunk.rejected,
      (
        state: IAddAssetState,
        action: PayloadAction<
          BaseExtensionError,
          string,
          IRejectedActionMeta<IQueryStandardAssetPayload>,
          SerializedError
        >
      ) => {
        // if it is an abort error, ignore as it is a new request
        if (action.error.name !== 'AbortError') {
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
    setSelectedAsset: (
      state: Draft<IAddAssetState>,
      action: PayloadAction<IAssetTypes | null>
    ) => {
      state.selectedAsset = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { clearAssets, reset, setAccountId, setSelectedAsset } =
  slice.actions;
