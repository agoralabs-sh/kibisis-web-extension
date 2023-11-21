import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// Thunks
import { saveCredentialsThunk } from './thunks';

// types
import { IRegistrationState, ISetPasswordPayload } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** Save credentials **/
    builder.addCase(
      saveCredentialsThunk.fulfilled,
      (state: IRegistrationState) => {
        const initialState: IRegistrationState = getInitialState();

        state.password = initialState.password;
        state.saving = initialState.saving;
        state.score = initialState.score;
      }
    );
    builder.addCase(
      saveCredentialsThunk.pending,
      (state: IRegistrationState) => {
        state.saving = true;
      }
    );
    builder.addCase(
      saveCredentialsThunk.rejected,
      (state: IRegistrationState) => {
        state.saving = false;
      }
    );
  },
  initialState: getInitialState(),
  name: StoreNameEnum.Register,
  reducers: {
    reset: (state: Draft<IRegistrationState>) => {
      const initialState: IRegistrationState = getInitialState();

      state.password = initialState.password;
      state.saving = initialState.saving;
      state.score = initialState.score;
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
export const { reset, setPassword } = slice.actions;
