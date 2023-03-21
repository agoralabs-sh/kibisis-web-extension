import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// Enums
import { StoreNameEnum } from '../../enums';

// Thunks
import { fetchSessions } from './thunks';

// Types
import { ISession } from '../../types';
import { ISessionsState } from './types';

// Utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** Fetch sessions **/
    builder.addCase(
      fetchSessions.fulfilled,
      (state: ISessionsState, action: PayloadAction<ISession[]>) => {
        state.items = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(fetchSessions.pending, (state: ISessionsState) => {
      state.fetching = true;
    });
    builder.addCase(fetchSessions.rejected, (state: ISessionsState) => {
      state.fetching = false;
    });
  },
  initialState: getInitialState(),
  name: StoreNameEnum.Sessions,
  reducers: {
    reset: (state: Draft<ISessionsState>) => {
      state.fetching = false;
      state.items = [];
      state.saving = false;
    },
  },
});

export const reducer: Reducer = slice.reducer;
