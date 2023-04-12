import { CreateToastFnReturn } from '@chakra-ui/react';
import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { NavigateFunction } from 'react-router-dom';

// Enums
import { StoreNameEnum } from '@extension/enums';

// Errors
import { BaseExtensionError } from '@extension/errors';

// Types
import { IApplicationState, IConfirm } from './types';

// Utils
import { getInitialState } from './utils';

const slice = createSlice({
  initialState: getInitialState(),
  name: StoreNameEnum.Application,
  reducers: {
    setConfirm: (
      state: Draft<IApplicationState>,
      action: PayloadAction<IConfirm | null>
    ) => {
      state.confirm = action.payload;
    },
    setError: (
      state: Draft<IApplicationState>,
      action: PayloadAction<BaseExtensionError | null>
    ) => {
      state.error = action.payload;
    },
    setNavigate: (
      state: Draft<IApplicationState>,
      action: PayloadAction<NavigateFunction>
    ) => {
      state.navigate = action.payload;
    },
    setOnline: (
      state: Draft<IApplicationState>,
      action: PayloadAction<boolean>
    ) => {
      state.online = action.payload;
    },
    setSideBar: (
      state: Draft<IApplicationState>,
      action: PayloadAction<boolean>
    ) => {
      state.sidebar = action.payload;
    },
    setToast: (
      state: Draft<IApplicationState>,
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
