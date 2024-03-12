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
import { queryARC0200AssetThunk, queryStandardAssetThunk } from './thunks';

// types
import {
  IARC0200Asset,
  IAssetTypes,
  IRejectedActionMeta,
  IStandardAsset,
} from '@extension/types';
import {
  IAssetsWithNextToken,
  IQueryARC0200AssetPayload,
  IQueryStandardAssetPayload,
  IState,
} from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** query arc200 asset **/
    builder.addCase(
      queryARC0200AssetThunk.fulfilled,
      (
        state: IState,
        action: PayloadAction<IAssetsWithNextToken<IARC0200Asset>>
      ) => {
        state.arc200Assets = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(queryARC0200AssetThunk.pending, (state: IState) => {
      state.fetching = true;
    });
    builder.addCase(
      queryARC0200AssetThunk.rejected,
      (
        state: IState,
        action: PayloadAction<
          BaseExtensionError,
          string,
          IRejectedActionMeta<IQueryARC0200AssetPayload>,
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
        state: IState,
        action: PayloadAction<IAssetsWithNextToken<IStandardAsset>>
      ) => {
        state.standardAssets = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(queryStandardAssetThunk.pending, (state: IState) => {
      state.fetching = true;
    });
    builder.addCase(
      queryStandardAssetThunk.rejected,
      (
        state: IState,
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
  name: StoreNameEnum.AddAssets,
  reducers: {
    clearAssets: (state: Draft<IState>) => {
      state.arc200Assets = {
        items: [],
        next: null,
      };
      state.standardAssets = {
        items: [],
        next: null,
      };
    },
    reset: (state: Draft<IState>) => {
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
  clearAssets,
  reset,
  setAccountId,
  setConfirming,
  setSelectedAsset,
} = slice.actions;
