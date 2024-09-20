import {
  createSlice,
  type PayloadAction,
  type Reducer,
} from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import {
  removeAllFromStorageThunk,
  fetchFromStorageThunk,
  removeByIdFromStorageThunk,
  saveToStorage,
} from './thunks';

// types
import type { IState } from './types';

// utils
import { getInitialState, upsertSessions } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /**fetch from storage**/
    builder.addCase(
      fetchFromStorageThunk.fulfilled,
      (state: IState, action) => {
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
    /**remove all from storage**/
    builder.addCase(removeAllFromStorageThunk.fulfilled, (state: IState) => {
      state.items = [];
      state.saving = false;
    });
    builder.addCase(removeAllFromStorageThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(removeAllFromStorageThunk.rejected, (state: IState) => {
      state.saving = false;
    });
    /**remove by id from storage**/
    builder.addCase(
      removeByIdFromStorageThunk.fulfilled,
      (state: IState, action: PayloadAction<string>) => {
        state.items = state.items.filter(
          (value) => value.id !== action.payload
        );
        state.saving = false;
      }
    );
    builder.addCase(removeByIdFromStorageThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(removeByIdFromStorageThunk.rejected, (state: IState) => {
      state.saving = false;
    });
    /**save to storage**/
    builder.addCase(saveToStorage.fulfilled, (state: IState, action) => {
      state.items = upsertSessions(state.items, [action.payload]);
      state.saving = false;
    });
    builder.addCase(saveToStorage.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(saveToStorage.rejected, (state: IState) => {
      state.saving = false;
    });
  },
  initialState: getInitialState(),
  name: StoreNameEnum.Sessions,
  reducers: {
    noop: () => {
      return;
    },
  },
});

export const reducer: Reducer = slice.reducer;
