import { CreateToastFnReturn } from '@chakra-ui/react';
import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// Enums
import { StoreNameEnum } from '../../enums';

// Errors
import { BaseError } from '../../errors';

// Types
import { IApplicationState } from './types';

// Utils
import { getInitialState } from './utils';

const slice = createSlice({
  name: StoreNameEnum.Application,
  initialState: getInitialState(),
  reducers: {
    setError: (
      state: Draft<IApplicationState>,
      action: PayloadAction<BaseError | null>
    ) => {
      state.error = action.payload;
    },
    setToast: (
      state: Draft<IApplicationState>,
      action: PayloadAction<CreateToastFnReturn>
    ) => {
      state.toast = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { setError, setToast } = slice.actions;
