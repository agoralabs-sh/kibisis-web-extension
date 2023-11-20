import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// Thunks
import { fetchSettings, setSettings } from './thunks';

// types
import { ISettings } from '@extension/types';
import { ISettingsState } from './types';

// utils
import { getInitialState, mapSettingsToState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** Fetch settings **/
    builder.addCase(
      fetchSettings.fulfilled,
      (state: ISettingsState, action: PayloadAction<ISettings>) => {
        state.fetching = false;

        mapSettingsToState(state, action.payload);
      }
    );
    builder.addCase(fetchSettings.pending, (state: ISettingsState) => {
      state.fetching = true;
    });
    builder.addCase(fetchSettings.rejected, (state: ISettingsState) => {
      state.fetching = false;
    });
    /** Set settings **/
    builder.addCase(
      setSettings.fulfilled,
      (state: ISettingsState, action: PayloadAction<ISettings>) => {
        state.saving = false;

        mapSettingsToState(state, action.payload);
      }
    );
    builder.addCase(setSettings.pending, (state: ISettingsState) => {
      state.saving = true;
    });
    builder.addCase(setSettings.rejected, (state: ISettingsState) => {
      state.saving = false;
    });
  },
  initialState: getInitialState(),
  name: StoreNameEnum.Settings,
  reducers: {
    reset: (state: Draft<ISettingsState>) => {
      state.fetching = false;
      state.saving = false;
    },
  },
});

export const reducer: Reducer = slice.reducer;
