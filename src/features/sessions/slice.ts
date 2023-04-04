import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// Enums
import { StoreNameEnum } from '../../enums';

// Thunks
import { fetchSessions, saveSession } from './thunks';

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
    /** Saving session **/
    builder.addCase(saveSession.fulfilled, (state: ISessionsState) => {
      state.saving = false;
    });
    builder.addCase(saveSession.pending, (state: ISessionsState) => {
      state.saving = true;
    });
    builder.addCase(saveSession.rejected, (state: ISessionsState) => {
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
