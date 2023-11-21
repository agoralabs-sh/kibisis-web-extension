import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// types
import {
  IEnableRequest,
  ISignBytesRequest,
  ISignTxnsRequest,
} from '@extension/types';
import { IMessagesState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  initialState: getInitialState(),
  name: StoreNameEnum.Messages,
  reducers: {
    setEnableRequest: (
      state: Draft<IMessagesState>,
      action: PayloadAction<IEnableRequest | null>
    ) => {
      state.enableRequest = action.payload;
    },
    setSignBytesRequest: (
      state: Draft<IMessagesState>,
      action: PayloadAction<ISignBytesRequest | null>
    ) => {
      state.signBytesRequest = action.payload;
    },
    setSignTxnsRequest: (
      state: Draft<IMessagesState>,
      action: PayloadAction<ISignTxnsRequest | null>
    ) => {
      state.signTxnsRequest = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { setEnableRequest, setSignBytesRequest, setSignTxnsRequest } =
  slice.actions;
