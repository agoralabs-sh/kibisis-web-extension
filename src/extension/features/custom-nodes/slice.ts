import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import { fetchFromStorageThunk, saveToStorageThunk } from './thunks';

// types
import type { ICustomNodeItem } from '@extension/services/CustomNodesService';
import type { IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** fetch from storage **/
    builder.addCase(
      fetchFromStorageThunk.fulfilled,
      (state: IState, action: PayloadAction<ICustomNodeItem[]>) => {
        state.items = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(fetchFromStorageThunk.pending, (state: IState) => {
      state.fetching = true;
    });
    builder.addCase(fetchFromStorageThunk.rejected, (state: IState) => {
      state.fetching = false;
    });
    /** save to storage **/
    builder.addCase(
      saveToStorageThunk.fulfilled,
      (state: IState, action: PayloadAction<ICustomNodeItem[]>) => {
        state.items = action.payload;
        state.saving = false;
      }
    );
    builder.addCase(saveToStorageThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(saveToStorageThunk.rejected, (state: IState) => {
      state.saving = false;
    });
  },
  initialState: getInitialState(),
  name: StoreNameEnum.CustomNodes,
  reducers: {
    noop: () => {
      return;
    },
  },
});

export const reducer: Reducer = slice.reducer;
