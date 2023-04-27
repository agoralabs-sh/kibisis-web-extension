import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// Enums
import { StoreNameEnum } from '@extension/enums';

// Thunks
import {
  fetchAccountsFromStorageThunk,
  removeAccountByIdThunk,
  saveNewAccountThunk,
  startPollingForAccountInformationThunk,
  stopPollingForAccountInformationThunk,
  updateAccountInformationThunk,
} from './thunks';

// Types
import { IAccount } from '@extension/types';
import { IAccountsState } from './types';

// Utils
import { upsertItemsById } from '@extension/utils';
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** Fetch accounts from storage **/
    builder.addCase(
      fetchAccountsFromStorageThunk.fulfilled,
      (state: IAccountsState, action: PayloadAction<IAccount[]>) => {
        state.items = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(
      fetchAccountsFromStorageThunk.pending,
      (state: IAccountsState) => {
        state.fetching = true;
      }
    );
    builder.addCase(
      fetchAccountsFromStorageThunk.rejected,
      (state: IAccountsState) => {
        state.fetching = false;
      }
    );
    /** Remove account by id **/
    builder.addCase(
      removeAccountByIdThunk.fulfilled,
      (state: IAccountsState, action: PayloadAction<string>) => {
        state.items = state.items.filter(
          (value) => value.id !== action.payload
        ); // filter the accounts excluding the removed account
        state.saving = false;
      }
    );
    builder.addCase(removeAccountByIdThunk.pending, (state: IAccountsState) => {
      state.saving = true;
    });
    builder.addCase(
      removeAccountByIdThunk.rejected,
      (state: IAccountsState) => {
        state.saving = false;
      }
    );
    /** Save new account **/
    builder.addCase(
      saveNewAccountThunk.fulfilled,
      (state: IAccountsState, action: PayloadAction<IAccount>) => {
        if (action.payload) {
          state.items = upsertItemsById<IAccount>(state.items, [
            action.payload,
          ]);
        }

        state.saving = false;
      }
    );
    builder.addCase(saveNewAccountThunk.pending, (state: IAccountsState) => {
      state.saving = true;
    });
    builder.addCase(saveNewAccountThunk.rejected, (state: IAccountsState) => {
      state.saving = false;
    });
    /** Start polling for account information **/
    builder.addCase(
      startPollingForAccountInformationThunk.fulfilled,
      (state: IAccountsState, action: PayloadAction<number>) => {
        state.pollingId = action.payload;
      }
    );
    /** Stop polling for account information **/
    builder.addCase(
      stopPollingForAccountInformationThunk.fulfilled,
      (state: IAccountsState) => {
        state.pollingId = null;
      }
    );
    /** Update account information **/
    builder.addCase(
      updateAccountInformationThunk.fulfilled,
      (state: IAccountsState, action: PayloadAction<IAccount[]>) => {
        state.items = action.payload;
        state.updating = false;
      }
    );
    builder.addCase(
      updateAccountInformationThunk.pending,
      (state: IAccountsState) => {
        state.updating = true;
      }
    );
    builder.addCase(
      updateAccountInformationThunk.rejected,
      (state: IAccountsState) => {
        state.updating = false;
      }
    );
  },
  initialState: getInitialState(),
  name: StoreNameEnum.Accounts,
  reducers: {
    noop: () => {
      return;
    },
  },
});

export const reducer: Reducer = slice.reducer;
