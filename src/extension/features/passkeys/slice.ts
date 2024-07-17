import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import {
  fetchFromStorageThunk,
  removeFromStorageThunk,
  saveToStorageThunk,
} from './thunks';

// types
import type { IPasskeyCredential } from '@extension/types';
import type { IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** fetch from storage **/
    builder.addCase(
      fetchFromStorageThunk.fulfilled,
      (state: IState, action: PayloadAction<IPasskeyCredential | null>) => {
        state.passkey = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(fetchFromStorageThunk.pending, (state: IState) => {
      state.fetching = true;
    });
    builder.addCase(fetchFromStorageThunk.rejected, (state: IState) => {
      state.fetching = false;
    });
    /** remove from storage **/
    builder.addCase(removeFromStorageThunk.fulfilled, (state: IState) => {
      state.passkey = null;
      state.saving = false;
    });
    builder.addCase(removeFromStorageThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(removeFromStorageThunk.rejected, (state: IState) => {
      state.saving = false;
    });
    /** save to storage **/
    builder.addCase(
      saveToStorageThunk.fulfilled,
      (state: IState, action: PayloadAction<IPasskeyCredential>) => {
        state.passkey = action.payload;
        state.saving = false;
      }
    );
    builder.addCase(saveToStorageThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(saveToStorageThunk.rejected, (state: IState) => {
      state.saving = false;
    });
  },
  initialState: getInitialState(),
  name: StoreNameEnum.Passkeys,
  reducers: {
    noop: () => {
      return;
    },
  },
});

export const reducer: Reducer = slice.reducer;
