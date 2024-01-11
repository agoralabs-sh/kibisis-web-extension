import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// messages
import {
  Arc0013EnableRequestMessage,
  Arc0013SignBytesRequestMessage,
  Arc0013SignTxnsRequestMessage,
} from '@common/messages';

// types
import { IClientRequest } from '@extension/types';
import { IEventsState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  initialState: getInitialState(),
  name: StoreNameEnum.Events,
  reducers: {
    setEnableRequest: (
      state: Draft<IEventsState>,
      action: PayloadAction<IClientRequest<Arc0013EnableRequestMessage> | null>
    ) => {
      state.enableRequest = action.payload;
    },
    setSignBytesRequest: (
      state: Draft<IEventsState>,
      action: PayloadAction<IClientRequest<Arc0013SignBytesRequestMessage> | null>
    ) => {
      state.signBytesRequest = action.payload;
    },
    setSignTxnsRequest: (
      state: Draft<IEventsState>,
      action: PayloadAction<IClientRequest<Arc0013SignTxnsRequestMessage> | null>
    ) => {
      state.signTxnsRequest = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { setEnableRequest, setSignBytesRequest, setSignTxnsRequest } =
  slice.actions;
