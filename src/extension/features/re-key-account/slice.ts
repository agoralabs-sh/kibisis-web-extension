import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import { undoReKeyAccountThunk } from './thunks';

// types
import type { IAccountWithExtendedProps } from '@extension/types';
import type { IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** undo re-key account **/
    builder.addCase(undoReKeyAccountThunk.fulfilled, (state: IState) => {
      state.confirming = false;
    });
    builder.addCase(undoReKeyAccountThunk.pending, (state: IState) => {
      state.confirming = true;
    });
    builder.addCase(undoReKeyAccountThunk.rejected, (state: IState) => {
      state.confirming = false;
    });
  },
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
  },
});

export const reducer: Reducer = slice.reducer;
export const { reset, setAccount } = slice.actions;
