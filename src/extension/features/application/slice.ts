import { CreateToastFnReturn } from '@chakra-ui/react';
import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { NavigateFunction } from 'react-router-dom';

// Enums
import { StoreNameEnum } from '@extension/enums';

// Errors
import { BaseExtensionError } from '@extension/errors';

// Thunks
import { checkInitializedThunk } from './thunks';

// Types
import { IApplicationState } from './types';

// Utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** Fetch accounts **/
    builder.addCase(
      checkInitializedThunk.fulfilled,
      (state: IApplicationState, action: PayloadAction<boolean>) => {
        state.isInitialized = action.payload;
      }
    );
  },
  initialState: getInitialState(),
  name: StoreNameEnum.Application,
  reducers: {
    setError: (
      state: Draft<IApplicationState>,
      action: PayloadAction<BaseExtensionError | null>
    ) => {
      state.error = action.payload;
    },
    setNavigate: (
      state: Draft<IApplicationState>,
      action: PayloadAction<NavigateFunction>
    ) => {
      state.navigate = action.payload;
    },
    setOnline: (
      state: Draft<IApplicationState>,
      action: PayloadAction<boolean>
    ) => {
      state.online = action.payload;
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
export const { setError, setNavigate, setOnline, setToast } = slice.actions;
