import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import { savePasswordLockThunk } from './thunks';

// types
import type { IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** Save credentials **/
    builder.addCase(
      savePasswordLockThunk.fulfilled,
      (state: IState, action: PayloadAction<string | null>) => {
        state.password = action.payload;
        state.saving = false;
      }
    );
    builder.addCase(savePasswordLockThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(savePasswordLockThunk.rejected, (state: IState) => {
      state.saving = false;
    });
  },
  initialState: getInitialState(),
  name: StoreNameEnum.PasswordLock,
  reducers: {
    setPassword: (
      state: Draft<IState>,
      action: PayloadAction<string | null>
    ) => {
      state.password = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { setPassword } = slice.actions;
