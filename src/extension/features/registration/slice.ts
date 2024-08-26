import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import { saveCredentialsThunk } from './thunks';

// types
import type { IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** save credentials **/
    builder.addCase(saveCredentialsThunk.fulfilled, (state: IState) => {
      const initialState: IState = getInitialState();

      state.password = initialState.password;
      state.saving = initialState.saving;
    });
    builder.addCase(saveCredentialsThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(saveCredentialsThunk.rejected, (state: IState) => {
      state.saving = false;
    });
  },
  initialState: getInitialState(),
  name: StoreNameEnum.Register,
  reducers: {
    reset: (state: Draft<IState>) => {
      const initialState: IState = getInitialState();

      state.importAccountViaQRCodeModalOpen =
        initialState.importAccountViaQRCodeModalOpen;
      state.password = initialState.password;
      state.saving = initialState.saving;
    },
    setImportAccountViaQRCodeOpen: (
      state: Draft<IState>,
      action: PayloadAction<boolean>
    ) => {
      state.importAccountViaQRCodeModalOpen = action.payload;
    },
    setPassword: (state: Draft<IState>, action: PayloadAction<string>) => {
      if (action.payload.length <= 0) {
        state.password = null;

        return;
      }

      state.password = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { reset, setImportAccountViaQRCodeOpen, setPassword } =
  slice.actions;
