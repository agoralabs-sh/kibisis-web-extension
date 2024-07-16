import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import { savePasswordLockThunk } from './thunks';

// types
import type { TEncryptionCredentials } from '@extension/types';
import type { IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /**save password lock**/
    builder.addCase(
      savePasswordLockThunk.fulfilled,
      (state: IState, action: PayloadAction<TEncryptionCredentials | null>) => {
        state.credentials = action.payload;
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
    setCredentials: (
      state: Draft<IState>,
      action: PayloadAction<TEncryptionCredentials | null>
    ) => {
      state.credentials = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { setCredentials } = slice.actions;
