import { createSlice, Draft, Reducer } from '@reduxjs/toolkit';

// Enums
import { StoreNameEnum } from '../../enums';

// Types
import { IRegisterState } from './types';

// Utils
import { getInitialState } from './utils';

const slice = createSlice({
  name: StoreNameEnum.Register,
  initialState: getInitialState(),
  reducers: {
    reset: (state: Draft<IRegisterState>) => {
      state.password = null;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { reset } = slice.actions;
