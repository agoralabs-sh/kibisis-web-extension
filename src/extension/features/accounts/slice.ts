import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import {
  fetchAccountsFromStorageThunk,
  removeAccountByIdThunk,
  saveNewAccountThunk,
  startPollingForAccountsThunk,
  stopPollingForAccountsThunk,
  updateAccountsThunk,
} from './thunks';

// types
import {
  IAccount,
  IPendingActionMeta,
  IRejectedActionMeta,
} from '@extension/types';
import {
  IAccountsState,
  IAccountUpdate,
  IUpdateAccountsPayload,
} from './types';

// utils
import { upsertItemsById } from '@extension/utils';
import { getInitialState } from './utils';
import { stat } from 'copy-webpack-plugin/types/utils';

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
      startPollingForAccountsThunk.fulfilled,
      (state: IAccountsState, action: PayloadAction<number>) => {
        state.pollingId = action.payload;
      }
    );
    /** stop polling for account information **/
    builder.addCase(
      stopPollingForAccountsThunk.fulfilled,
      (state: IAccountsState) => {
        state.pollingId = null;
      }
    );
    /** update accounts **/
    builder.addCase(
      updateAccountsThunk.fulfilled,
      (state: IAccountsState, action: PayloadAction<IAccount[]>) => {
        state.items = state.items.map(
          (account) =>
            action.payload.find((value) => value.id === account.id) || account
        );

        // remove all the updated accounts from the account update list
        state.updatingAccounts = state.updatingAccounts.filter(
          (accountUpdate) =>
            !action.payload.find((value) => value.id === accountUpdate.id)
        );
      }
    );
    builder.addCase(
      updateAccountsThunk.pending,
      (state: IAccountsState, action) => {
        // if no account ids, all accounts are being updated
        if (!action.meta.arg?.accountIds) {
          state.updatingAccounts = state.items.map((value) => ({
            id: value.id,
            information: true,
            transactions: !action.meta?.arg?.informationOnly,
          }));

          return;
        }

        // filter the accounts by the supplied ids
        state.updatingAccounts = [
          ...(state.updatingAccounts = state.updatingAccounts.filter(
            (accountUpdate) =>
              !action.meta.arg?.accountIds?.find(
                (value) => value === accountUpdate.id
              )
          )),
          ...(action.meta.arg?.accountIds?.map((value) => ({
            id: value,
            information: true,
            transactions: !action.meta?.arg?.informationOnly,
          })) || []),
        ];
      }
    );
    builder.addCase(
      updateAccountsThunk.rejected,
      (state: IAccountsState, action) => {
        // if no account ids, no accounts are being updated
        if (!action.meta.arg?.accountIds) {
          state.updatingAccounts = [];

          return;
        }

        // filter the accounts by the supplied ids
        state.updatingAccounts = [
          ...(state.updatingAccounts = state.updatingAccounts.filter(
            (accountUpdate) =>
              !action.meta.arg?.accountIds?.find(
                (value) => value === accountUpdate.id
              )
          )),
          ...(action.meta.arg?.accountIds?.map((value) => ({
            id: value,
            information: false,
            transactions: false,
          })) || []),
        ];
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
