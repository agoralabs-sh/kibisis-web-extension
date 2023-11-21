import { createSlice, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  initialState: getInitialState(),
  name: StoreNameEnum.Networks,
  reducers: {
    noop: () => {
      return;
    },
  },
});

export const reducer: Reducer = slice.reducer;
