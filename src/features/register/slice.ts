import { createSlice, Draft, Reducer } from '@reduxjs/toolkit';

// Enums
import { StoreNameEnum } from '../../enums';

// Thunks
import { saveCredentials, setPrivateKey } from './thunks';

// Types
import { IRegisterState } from './types';

// Utils
import { getInitialState } from './utils';

const slice = createSlice({
  name: StoreNameEnum.Register,
  initialState: getInitialState(),
  reducers: {
    reset: (state: Draft<IRegisterState>) => {
      state = getInitialState();
    },
  },
  extraReducers: (builder) => {
    /** Save credentials **/
    builder.addCase(saveCredentials.fulfilled, (state: IRegisterState) => {
      state = getInitialState();
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
export const { reset } = slice.actions;
