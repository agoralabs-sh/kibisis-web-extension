import { CreateToastFnReturn } from '@chakra-ui/react';
import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { NavigateFunction } from 'react-router-dom';

// enums
import { StoreNameEnum } from '@extension/enums';

// errors
import { BaseExtensionError } from '@extension/errors';

// types
import { ISystemState, IConfirm } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  initialState: getInitialState(),
  name: StoreNameEnum.System,
  reducers: {
    setConfirm: (
      state: Draft<ISystemState>,
      action: PayloadAction<IConfirm | null>
    ) => {
      state.confirm = action.payload;
    },
    setError: (
      state: Draft<ISystemState>,
      action: PayloadAction<BaseExtensionError | null>
    ) => {
      state.error = action.payload;
    },
    setNavigate: (
      state: Draft<ISystemState>,
      action: PayloadAction<NavigateFunction>
    ) => {
      state.navigate = action.payload;
    },
    setOnline: (state: Draft<ISystemState>, action: PayloadAction<boolean>) => {
      state.online = action.payload;
    },
    setSideBar: (
      state: Draft<ISystemState>,
      action: PayloadAction<boolean>
    ) => {
      state.sidebar = action.payload;
    },
    setToast: (
      state: Draft<ISystemState>,
      action: PayloadAction<CreateToastFnReturn>
    ) => {
      state.toast = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const {
  setConfirm,
  setError,
  setNavigate,
  setOnline,
  setSideBar,
  setToast,
} = slice.actions;
