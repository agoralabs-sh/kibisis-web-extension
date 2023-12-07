import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// types
import {
  IEnableRequest,
  ISignBytesRequest,
  ISignTxnsRequest,
} from '@extension/types';
import { IEventsState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  initialState: getInitialState(),
  name: StoreNameEnum.Events,
  reducers: {
    setEnableRequest: (
      state: Draft<IEventsState>,
      action: PayloadAction<IEnableRequest | null>
    ) => {
      state.enableRequest = action.payload;
    },
    setSignBytesRequest: (
      state: Draft<IEventsState>,
      action: PayloadAction<ISignBytesRequest | null>
    ) => {
      state.signBytesRequest = action.payload;
    },
    setSignTxnsRequest: (
      state: Draft<IEventsState>,
      action: PayloadAction<ISignTxnsRequest | null>
    ) => {
      state.signTxnsRequest = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { setEnableRequest, setSignBytesRequest, setSignTxnsRequest } =
  slice.actions;
