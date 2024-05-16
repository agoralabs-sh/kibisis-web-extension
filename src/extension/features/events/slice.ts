import type {
  IEnableParams,
  ISignMessageParams,
  ISignTransactionsParams,
} from '@agoralabs-sh/avm-web-provider';
import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// types
import type { IClientRequestEvent } from '@extension/types';
import type { IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  initialState: getInitialState(),
  name: StoreNameEnum.Events,
  reducers: {
    setEnableRequest: (
      state: Draft<IState>,
      action: PayloadAction<IClientRequestEvent<IEnableParams> | null>
    ) => {
      state.enableRequest = action.payload;
    },
    setSignMessageRequest: (
      state: Draft<IState>,
      action: PayloadAction<IClientRequestEvent<ISignMessageParams> | null>
    ) => {
      state.signMessageRequest = action.payload;
    },
    setSignTransactionsRequest: (
      state: Draft<IState>,
      action: PayloadAction<IClientRequestEvent<ISignTransactionsParams> | null>
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
