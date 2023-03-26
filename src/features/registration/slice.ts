import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// Enums
import { StoreNameEnum } from '../../enums';

// Thunks
import { saveCredentials, setPrivateKey } from './thunks';

// Types
import { IRegistrationState, ISetPasswordPayload } from './types';

// Utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** Save credentials **/
    builder.addCase(saveCredentials.fulfilled, (state: IRegistrationState) => {
      const initialState: IRegistrationState = getInitialState();

      state.encryptedPrivateKey = initialState.encryptedPrivateKey;
      state.encrypting = initialState.encrypting;
      state.password = initialState.password;
      state.saving = initialState.saving;
      state.score = initialState.score;
    });
    builder.addCase(saveCredentials.pending, (state: IRegistrationState) => {
      state.saving = true;
    });
    builder.addCase(saveCredentials.rejected, (state: IRegistrationState) => {
      state.saving = false;
    });
    /** Set private key **/
    builder.addCase(
      setPrivateKey.fulfilled,
      (state: IRegistrationState, action) => {
        state.encryptedPrivateKey = action.payload;
        state.encrypting = false;
      }
    );
    builder.addCase(setPrivateKey.pending, (state: IRegistrationState) => {
      state.encrypting = true;
    });
    builder.addCase(setPrivateKey.rejected, (state: IRegistrationState) => {
      state.encryptedPrivateKey = null;
      state.encrypting = false;
    });
  },
  initialState: getInitialState(),
  name: StoreNameEnum.Register,
  reducers: {
    clearPrivateKey: (state: Draft<IRegistrationState>) => {
      state.encryptedPrivateKey = null;
    },
    reset: (state: Draft<IRegistrationState>) => {
      const initialState: IRegistrationState = getInitialState();

      state.encryptedPrivateKey = initialState.encryptedPrivateKey;
      state.encrypting = initialState.encrypting;
      state.name = initialState.name;
      state.password = initialState.password;
      state.saving = initialState.saving;
      state.score = initialState.score;
    },
    setName: (
      state: Draft<IRegistrationState>,
      action: PayloadAction<string>
    ) => {
      if (action.payload.length <= 0) {
        state.name = null;

        return;
      }

      state.name = action.payload;
    },
    setPassword: (
      state: Draft<IRegistrationState>,
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
export const { clearPrivateKey, reset, setName, setPassword } = slice.actions;
