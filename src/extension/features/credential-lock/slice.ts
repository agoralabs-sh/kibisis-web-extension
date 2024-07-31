import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import {
  deactivateThunk,
  disableThunk,
  enableThunk,
  fetchActiveThunk,
} from './thunks';

// types
import type { IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** deactivate **/
    builder.addCase(deactivateThunk.fulfilled, (state: IState) => {
      state.active = false;
    });
    /** disable **/
    builder.addCase(disableThunk.fulfilled, (state: IState) => {
      state.active = false;
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
      state.active = false;
      state.saving = false;
    });
    builder.addCase(enableThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(enableThunk.rejected, (state: IState) => {
      state.saving = false;
    });
    /** fetch active **/
    builder.addCase(
      fetchActiveThunk.fulfilled,
      (state: IState, action: PayloadAction<boolean>) => {
        state.active = action.payload;
      }
    );
  },
  initialState: getInitialState(),
  name: StoreNameEnum.CredentialLock,
  reducers: {
    setActive: (state: Draft<IState>, action: PayloadAction<boolean>) => {
      state.active = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { setActive } = slice.actions;
