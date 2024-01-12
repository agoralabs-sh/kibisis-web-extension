import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// messages
import {
  Arc0027EnableRequestMessage,
  Arc0027SignBytesRequestMessage,
  Arc0027SignTxnsRequestMessage,
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
      action: PayloadAction<IClientRequest<Arc0027EnableRequestMessage> | null>
    ) => {
      state.enableRequest = action.payload;
    },
    setSignBytesRequest: (
      state: Draft<IEventsState>,
      action: PayloadAction<IClientRequest<Arc0027SignBytesRequestMessage> | null>
    ) => {
      state.signBytesRequest = action.payload;
    },
    setSignTxnsRequest: (
      state: Draft<IEventsState>,
      action: PayloadAction<IClientRequest<Arc0027SignTxnsRequestMessage> | null>
    ) => {
      state.signTxnsRequest = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { setEnableRequest, setSignBytesRequest, setSignTxnsRequest } =
  slice.actions;
