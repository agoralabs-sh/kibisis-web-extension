import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// types
import type { IAccountWithExtendedProps } from '@extension/types';
import type { IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  initialState: getInitialState(),
  name: StoreNameEnum.ReKeyAccount,
  reducers: {
    reset: (state: Draft<IState>) => {
      state.account = null;
      state.confirming = false;
    },
    setAccount: (
      state: Draft<IState>,
      action: PayloadAction<IAccountWithExtendedProps | null>
    ) => {
      state.account = action.payload;
    },
    setConfirming: (state: Draft<IState>, action: PayloadAction<boolean>) => {
      state.confirming = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { reset, setAccount, setConfirming } = slice.actions;
