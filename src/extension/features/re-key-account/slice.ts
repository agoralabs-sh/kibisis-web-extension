import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import { reKeyAccountThunk, undoReKeyAccountThunk } from './thunks';

// types
import type { ISetAccountAndActionPayload, IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** re-key account **/
    builder.addCase(reKeyAccountThunk.fulfilled, (state: IState) => {
      state.confirming = false;
    });
    builder.addCase(reKeyAccountThunk.pending, (state: IState) => {
      state.confirming = true;
    });
    builder.addCase(reKeyAccountThunk.rejected, (state: IState) => {
      state.confirming = false;
    });
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
      state.type = null;
      state.confirming = false;
    },
    setAccountAndType: (
      state: Draft<IState>,
      action: PayloadAction<ISetAccountAndActionPayload>
    ) => {
      state.account = action.payload.account;
      state.type = action.payload.type;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { reset, setAccountAndType } = slice.actions;
