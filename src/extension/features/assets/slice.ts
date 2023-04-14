import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// Enums
import { StoreNameEnum } from '@extension/enums';

// Thunks
import { fetchAssetsThunk, updateAssetInformationThunk } from './thunks';

// Types
import { IAsset } from '@extension/types';
import { IAssetsState, IUpdateAssetInformationResult } from './types';

// Utils
import { getInitialState, upsertAssets } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** Fetch assets **/
    builder.addCase(
      fetchAssetsThunk.fulfilled,
      (
        state: IAssetsState,
        action: PayloadAction<Record<string, IAsset[]>>
      ) => {
        state.items = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(fetchAssetsThunk.pending, (state: IAssetsState) => {
      state.fetching = true;
    });
    builder.addCase(fetchAssetsThunk.rejected, (state: IAssetsState) => {
      state.fetching = false;
    });
    /** Update assets information **/
    builder.addCase(
      updateAssetInformationThunk.fulfilled,
      (
        state: IAssetsState,
        action: PayloadAction<IUpdateAssetInformationResult | null>
      ) => {
        if (action.payload) {
          state.items = {
            ...state.items,
            [action.payload.encodedGenesisHash]: upsertAssets(
              state.items ? state.items[action.payload.encodedGenesisHash] : [],
              action.payload.assets
            ),
          };
        }

        state.updating = false;
      }
    );
    builder.addCase(
      updateAssetInformationThunk.pending,
      (state: IAssetsState) => {
        state.updating = true;
      }
    );
    builder.addCase(
      updateAssetInformationThunk.rejected,
      (state: IAssetsState) => {
        state.updating = false;
      }
    );
  },
  initialState: getInitialState(),
  name: StoreNameEnum.Assets,
  reducers: {
    noop: () => {
      return;
    },
  },
});

export const reducer: Reducer = slice.reducer;
