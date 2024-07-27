import { createSlice, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import { disableThunk, enableThunk } from './thunks';

// types
import type { IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** disable **/
    builder.addCase(disableThunk.fulfilled, (state: IState) => {
      state.saving = false;
    });
    builder.addCase(disableThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(disableThunk.rejected, (state: IState) => {
      state.saving = false;
    });
    /** enable **/
    builder.addCase(enableThunk.fulfilled, (state: IState) => {
      state.saving = false;
    });
    builder.addCase(enableThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(enableThunk.rejected, (state: IState) => {
      state.saving = false;
    });
  },
  initialState: getInitialState(),
  name: StoreNameEnum.CredentialLock,
  reducers: {
    noop: () => {
      return;
    },
  },
});

export const reducer: Reducer = slice.reducer;
