import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// types
import { IPasswordLockState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
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
