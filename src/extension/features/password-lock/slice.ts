import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import { savePasswordLockThunk } from './thunks';

// types
import { IPasswordLockState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** Save credentials **/
    builder.addCase(
      savePasswordLockThunk.fulfilled,
      (state: IPasswordLockState, action: PayloadAction<string | null>) => {
        state.password = action.payload;
        state.saving = false;
      }
    );
    builder.addCase(
      savePasswordLockThunk.pending,
      (state: IPasswordLockState) => {
        state.saving = true;
      }
    );
    builder.addCase(
      savePasswordLockThunk.rejected,
      (state: IPasswordLockState) => {
        state.saving = false;
      }
    );
  },
  initialState: getInitialState(),
  name: StoreNameEnum.PasswordLock,
  reducers: {
    setPassword: (
      state: Draft<IPasswordLockState>,
      action: PayloadAction<string | null>
    ) => {
      state.password = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { setPassword } = slice.actions;
