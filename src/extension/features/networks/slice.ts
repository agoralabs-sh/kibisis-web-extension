import { createSlice, Draft, Reducer } from '@reduxjs/toolkit';

// Enums
import { StoreNameEnum } from '@extension/enums';

// Types
import { INetworksState } from './types';

// Utils
import { getInitialState } from './utils';

const slice = createSlice({
  initialState: getInitialState(),
  name: StoreNameEnum.Networks,
  reducers: {
    reset: (state: Draft<INetworksState>) => {
      state.items = [];
    },
  },
});

export const reducer: Reducer = slice.reducer;
