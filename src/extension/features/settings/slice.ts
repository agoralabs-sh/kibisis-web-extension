import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import {
  fetchSettingsFromStorageThunk,
  saveSettingsToStorageThunk,
} from './thunks';

// types
import type { ISettings } from '@extension/types';
import type { IState } from './types';

// utils
import { getInitialState, mapSettingsToState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** fetch settings from storage **/
    builder.addCase(
      fetchSettingsFromStorageThunk.fulfilled,
      (state: IState, action: PayloadAction<ISettings>) => {
        state.fetching = false;

        mapSettingsToState(state, action.payload);
      }
    );
    builder.addCase(fetchSettingsFromStorageThunk.pending, (state: IState) => {
      state.fetching = true;
    });
    builder.addCase(fetchSettingsFromStorageThunk.rejected, (state: IState) => {
      state.fetching = false;
    });
    /** save settings to storage **/
    builder.addCase(
      saveSettingsToStorageThunk.fulfilled,
      (state: IState, action: PayloadAction<ISettings>) => {
        state.saving = false;

        mapSettingsToState(state, action.payload);
      }
    );
    builder.addCase(saveSettingsToStorageThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(saveSettingsToStorageThunk.rejected, (state: IState) => {
      state.saving = false;
    });
  },
  initialState: getInitialState(),
  name: StoreNameEnum.Settings,
  reducers: {
    noop: () => {
      return;
    },
  },
});

export const reducer: Reducer = slice.reducer;
