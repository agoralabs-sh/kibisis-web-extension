import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import { handleNewEventByIdThunk, removeEventByIdThunk } from './thunks';

// types
import type { TEvents } from '@extension/types';
import type { IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(
      handleNewEventByIdThunk.fulfilled,
      (state: IState, action: PayloadAction<TEvents | null>) => {
        if (action.payload) {
          state.items = [
            ...state.items.filter((value) => value.id !== action.payload?.id),
            action.payload,
          ];
        }
      }
    );
    builder.addCase(
      removeEventByIdThunk.fulfilled,
      (state: IState, action: PayloadAction<string>) => {
        state.items = state.items.filter(
          (value) => value.id !== action.payload
        );
      }
    );
  },
  initialState: getInitialState(),
  name: StoreNameEnum.Events,
  reducers: {
    noop: () => {
      return;
    },
  },
});

export const reducer: Reducer = slice.reducer;
