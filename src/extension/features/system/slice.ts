import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// types
import type { ILogger } from '@common/types';
import type { IConfirmModal, IScanQRCodeModal, ISystemState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  initialState: getInitialState(),
  name: StoreNameEnum.System,
  reducers: {
    setConfirmModal: (
      state: Draft<ISystemState>,
      action: PayloadAction<IConfirmModal | null>
    ) => {
      state.confirmModal = action.payload;
    },
    setLogger: (state: Draft<ISystemState>, action: PayloadAction<ILogger>) => {
      state.logger = action.payload;
    },
    setOnline: (state: Draft<ISystemState>, action: PayloadAction<boolean>) => {
      state.online = action.payload;
    },
    setScanQRCodeModal: (
      state: Draft<ISystemState>,
      action: PayloadAction<IScanQRCodeModal | null>
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
  setConfirmModal,
  setLogger,
  setOnline,
  setScanQRCodeModal,
  setSideBar,
} = slice.actions;
