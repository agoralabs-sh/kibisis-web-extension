import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import {
  fetchAccountsFromStorageThunk,
  removeAccountByIdThunk,
  saveNewAccountThunk,
  startPollingForAccountInformationThunk,
  stopPollingForAccountInformationThunk,
  updateAccountInformationThunk,
  updateAccountTransactionsThunk,
} from './thunks';

// types
import { IAccount } from '@extension/types';
import { IAccountsState } from './types';

// utils
import { upsertItemsById } from '@extension/utils';
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** fetch accounts from storage **/
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
    /** remove account by id **/
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
    /** save new account **/
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
    /** start polling for account information **/
    builder.addCase(
      startPollingForAccountInformationThunk.fulfilled,
      (state: IAccountsState, action: PayloadAction<number>) => {
        state.pollingId = action.payload;
      }
    );
    /** stop polling for account information **/
    builder.addCase(
      stopPollingForAccountInformationThunk.fulfilled,
      (state: IAccountsState) => {
        state.pollingId = null;
      }
    );
    /** update account information **/
    builder.addCase(
      updateAccountInformationThunk.fulfilled,
      (state: IAccountsState, action: PayloadAction<IAccount[]>) => {
        state.items = state.items.map(
          (account) =>
            action.payload.find((value) => value.id === account.id) || account
        );
        state.updatingInformation = false;
      }
    );
    builder.addCase(
      updateAccountInformationThunk.pending,
      (state: IAccountsState) => {
        state.updatingInformation = true;
      }
    );
    builder.addCase(
      updateAccountInformationThunk.rejected,
      (state: IAccountsState) => {
        state.updatingInformation = false;
      }
    );
    /** update account transactions **/
    builder.addCase(
      updateAccountTransactionsThunk.fulfilled,
      (state: IAccountsState, action: PayloadAction<IAccount[]>) => {
        state.items = state.items.map(
          (account) =>
            action.payload.find((value) => value.id === account.id) || account
        );
        state.updatingTransactions = false;
      }
    );
    builder.addCase(
      updateAccountTransactionsThunk.pending,
      (state: IAccountsState) => {
        state.updatingTransactions = true;
      }
    );
    builder.addCase(
      updateAccountTransactionsThunk.rejected,
      (state: IAccountsState) => {
        state.updatingTransactions = false;
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
