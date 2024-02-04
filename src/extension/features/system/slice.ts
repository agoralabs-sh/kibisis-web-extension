import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { NavigateFunction } from 'react-router-dom';

// enums
import { StoreNameEnum } from '@extension/enums';

// errors
import { BaseExtensionError } from '@extension/errors';

// types
import { ILogger } from '@common/types';
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
    setLogger: (state: Draft<ISystemState>, action: PayloadAction<ILogger>) => {
      state.logger = action.payload;
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
    setScanQRCodeModal: (
      state: Draft<ISystemState>,
      action: PayloadAction<boolean>
    ) => {
      state.scanQRCodeModal = action.payload;
    },
    setSideBar: (
      state: Draft<ISystemState>,
      action: PayloadAction<boolean>
    ) => {
      state.sidebar = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const {
  setConfirm,
  setError,
  setLogger,
  setNavigate,
  setOnline,
  setScanQRCodeModal,
  setSideBar,
} = slice.actions;
