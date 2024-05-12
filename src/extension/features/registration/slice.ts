import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import { saveCredentialsThunk } from './thunks';

// types
import type { ISetPasswordPayload, IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** save credentials **/
    builder.addCase(saveCredentialsThunk.fulfilled, (state: IState) => {
      const initialState: IState = getInitialState();

      state.password = initialState.password;
      state.saving = initialState.saving;
      state.score = initialState.score;
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
      state.score = initialState.score;
    },
    setImportAccountViaQRCodeOpen: (
      state: Draft<IState>,
      action: PayloadAction<boolean>
    ) => {
      state.importAccountViaQRCodeModalOpen = action.payload;
    },
    setPassword: (
      state: Draft<IState>,
      action: PayloadAction<ISetPasswordPayload>
    ) => {
      if (action.payload.password.length <= 0) {
        state.password = null;
        state.score = -1;

        return;
      }

      state.password = action.payload.password;
      state.score = action.payload.score;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { reset, setImportAccountViaQRCodeOpen, setPassword } =
  slice.actions;
