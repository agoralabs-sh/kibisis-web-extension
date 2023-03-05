import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// Enums
import { StoreNameEnum } from '../../enums';

// Thunks
import { saveCredentials, setPrivateKey } from './thunks';

// Types
import { IRegisterState, ISetPasswordPayload } from './types';

// Utils
import { getInitialState } from './utils';

const slice = createSlice({
  name: StoreNameEnum.Register,
  initialState: getInitialState(),
  reducers: {
    clearPrivateKey: (state: Draft<IRegisterState>) => {
      state.encryptedPrivateKey = null;
    },
    reset: (state: Draft<IRegisterState>) => {
      const initialState: IRegisterState = getInitialState();

      state.encryptedPrivateKey = initialState.encryptedPrivateKey;
      state.encrypting = initialState.encrypting;
      state.password = initialState.password;
      state.saving = initialState.saving;
      state.score = initialState.score;
    },
    setPassword: (
      state: Draft<IRegisterState>,
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
  extraReducers: (builder) => {
    /** Save credentials **/
    builder.addCase(saveCredentials.fulfilled, (state: IRegisterState) => {
      const initialState: IRegisterState = getInitialState();

      state.encryptedPrivateKey = initialState.encryptedPrivateKey;
      state.encrypting = initialState.encrypting;
      state.password = initialState.password;
      state.saving = initialState.saving;
      state.score = initialState.score;
    });
    builder.addCase(saveCredentials.pending, (state: IRegisterState) => {
      state.saving = true;
    });
    builder.addCase(saveCredentials.rejected, (state: IRegisterState) => {
      state.saving = false;
    });
    /** Set private key **/
    builder.addCase(
      setPrivateKey.fulfilled,
      (state: IRegisterState, action) => {
        state.encryptedPrivateKey = action.payload;
        state.encrypting = false;
      }
    );
    builder.addCase(setPrivateKey.pending, (state: IRegisterState) => {
      state.encrypting = true;
    });
    builder.addCase(setPrivateKey.rejected, (state: IRegisterState) => {
      state.encryptedPrivateKey = null;
      state.encrypting = false;
    });
  },
});

export const reducer: Reducer = slice.reducer;
export const { clearPrivateKey, reset, setPassword } = slice.actions;
