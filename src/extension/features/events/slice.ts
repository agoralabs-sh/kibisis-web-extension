import type {
  IEnableParams,
  ISignMessageParams,
  ISignTransactionsParams,
} from '@agoralabs-sh/avm-web-provider';
import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// types
import type { IClientRequestEventPayload, IEvent } from '@extension/types';
import type { IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  initialState: getInitialState(),
  name: StoreNameEnum.Events,
  reducers: {
    setEnableRequest: (
      state: Draft<IState>,
      action: PayloadAction<IEvent<
        IClientRequestEventPayload<IEnableParams>
      > | null>
    ) => {
      state.enableRequest = action.payload;
    },
    setSignMessageRequest: (
      state: Draft<IState>,
      action: PayloadAction<IEvent<
        IClientRequestEventPayload<ISignMessageParams>
      > | null>
    ) => {
      state.signMessageRequest = action.payload;
    },
    setSignTransactionsRequest: (
      state: Draft<IState>,
      action: PayloadAction<IEvent<
        IClientRequestEventPayload<ISignTransactionsParams>
      > | null>
    ) => {
      state.signTransactionsRequest = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const {
  setEnableRequest,
  setSignMessageRequest,
  setSignTransactionsRequest,
} = slice.actions;
