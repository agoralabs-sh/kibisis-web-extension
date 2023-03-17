import { CreateToastFnReturn } from '@chakra-ui/react';
import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { NavigateFunction } from 'react-router-dom';

// Enums
import { StoreNameEnum } from '../../enums';

// Errors
import { BaseError } from '../../errors';

// Types
import { IApplicationState } from './types';

// Utils
import { getInitialState } from './utils';

const slice = createSlice({
  initialState: getInitialState(),
  name: StoreNameEnum.Application,
  reducers: {
    setError: (
      state: Draft<IApplicationState>,
      action: PayloadAction<BaseError | null>
    ) => {
      state.error = action.payload;
    },
    setNavigate: (
      state: Draft<IApplicationState>,
      action: PayloadAction<NavigateFunction>
    ) => {
      state.navigate = action.payload;
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
export const { setError, setNavigate, setToast } = slice.actions;
