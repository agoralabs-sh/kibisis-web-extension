import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import { fetchFromStorageThunk } from './thunks';

// types
import type { ILogger } from '@common/types';
import type { ISystemInfo } from '@extension/types';
import type { IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** fetch from storage **/
    builder.addCase(
      fetchFromStorageThunk.fulfilled,
      (state: IState, action: PayloadAction<ISystemInfo>) => {
        state.info = action.payload;
      }
    );
  },
  initialState: getInitialState(),
  name: StoreNameEnum.System,
  reducers: {
    setLogger: (state: Draft<IState>, action: PayloadAction<ILogger>) => {
      state.logger = action.payload;
    },
    setOnline: (state: Draft<IState>, action: PayloadAction<boolean>) => {
      state.online = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { setLogger, setOnline } = slice.actions;
