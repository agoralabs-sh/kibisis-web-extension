import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import {
  CredentialLockActivationStateEnum,
  StoreNameEnum,
} from '@extension/enums';

// thunks
import { disableThunk, enableThunk, fetchActivatedThunk } from './thunks';

// types
import type { IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** disable **/
    builder.addCase(disableThunk.fulfilled, (state: IState) => {
      state.activated = null;
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
      state.activated = CredentialLockActivationStateEnum.Inactive;
      state.saving = false;
    });
    builder.addCase(enableThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(enableThunk.rejected, (state: IState) => {
      state.saving = false;
    });
    /** fetch activated **/
    builder.addCase(
      fetchActivatedThunk.fulfilled,
      (
        state: IState,
        action: PayloadAction<CredentialLockActivationStateEnum | null>
      ) => {
        state.activated = action.payload;
      }
    );
  },
  initialState: getInitialState(),
  name: StoreNameEnum.CredentialLock,
  reducers: {
    setActivated: (
      state: Draft<IState>,
      action: PayloadAction<CredentialLockActivationStateEnum | null>
    ) => {
      state.activated = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { setActivated } = slice.actions;
