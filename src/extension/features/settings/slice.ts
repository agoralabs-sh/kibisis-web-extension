import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import { fetchSettingsFromStorage, saveSettingsToStorage } from './thunks';

// types
import { ISettings } from '@extension/types';
import { ISettingsState } from './types';

// utils
import { getInitialState, mapSettingsToState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** fetch settings from storage **/
    builder.addCase(
      fetchSettingsFromStorage.fulfilled,
      (state: ISettingsState, action: PayloadAction<ISettings>) => {
        state.fetching = false;

        mapSettingsToState(state, action.payload);
      }
    );
    builder.addCase(
      fetchSettingsFromStorage.pending,
      (state: ISettingsState) => {
        state.fetching = true;
      }
    );
    builder.addCase(
      fetchSettingsFromStorage.rejected,
      (state: ISettingsState) => {
        state.fetching = false;
      }
    );
    /** save settings to storage **/
    builder.addCase(
      saveSettingsToStorage.fulfilled,
      (state: ISettingsState, action: PayloadAction<ISettings>) => {
        state.saving = false;

        mapSettingsToState(state, action.payload);
      }
    );
    builder.addCase(saveSettingsToStorage.pending, (state: ISettingsState) => {
      state.saving = true;
    });
    builder.addCase(saveSettingsToStorage.rejected, (state: ISettingsState) => {
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
