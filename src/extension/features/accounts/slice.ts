import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import {
  addARC0200AssetHoldingsThunk,
  fetchAccountsFromStorageThunk,
  removeAccountByIdThunk,
  removeARC0200AssetHoldingsThunk,
  saveAccountNameThunk,
  saveActiveAccountDetails,
  saveNewAccountThunk,
  startPollingForAccountsThunk,
  stopPollingForAccountsThunk,
  updateAccountsThunk,
} from './thunks';

// types
import type { IAccount, IActiveAccountDetails } from '@extension/types';
import type { IAccountsState, IFetchAccountsFromStorageResult } from './types';

// utils
import upsertItemsById from '@extension/utils/upsertItemsById';
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** add arc200 asset holdings **/
    builder.addCase(
      addARC0200AssetHoldingsThunk.fulfilled,
      (state: IAccountsState, action: PayloadAction<IAccount | null>) => {
        if (action.payload) {
          state.items = state.items.map((value) =>
            value.id === action.payload?.id ? action.payload : value
          );
        }

        // remove updated account from the account update list
        state.updatingAccounts = state.updatingAccounts.filter(
          (value) => value.id !== action.payload?.id
        );
      }
    );
    builder.addCase(
      addARC0200AssetHoldingsThunk.pending,
      (state: IAccountsState, action) => {
        state.updatingAccounts = [
          // filter the unrelated updating account ids
          ...(state.updatingAccounts = state.updatingAccounts.filter(
            (value) => value.id !== action.meta.arg.accountId
          )),
          // re-add the account being updated
          {
            id: action.meta.arg.accountId,
            information: true,
            transactions: false,
          },
        ];
      }
    );
    builder.addCase(
      addARC0200AssetHoldingsThunk.rejected,
      (state: IAccountsState, action) => {
        // remove updated account from the account update list
        state.updatingAccounts = state.updatingAccounts.filter(
          (value) => value.id !== action.meta.arg.accountId
        );
      }
    );
    /** fetch accounts from storage **/
    builder.addCase(
      fetchAccountsFromStorageThunk.fulfilled,
      (
        state: IAccountsState,
        action: PayloadAction<IFetchAccountsFromStorageResult>
      ) => {
        state.activeAccountDetails = action.payload.activeAccountDetails;
        state.items = action.payload.accounts;
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
    /** remove arc200 asset holdings **/
    builder.addCase(
      removeARC0200AssetHoldingsThunk.fulfilled,
      (state: IAccountsState, action: PayloadAction<IAccount | null>) => {
        if (action.payload) {
          state.items = state.items.map((value) =>
            value.id === action.payload?.id ? action.payload : value
          );
        }

        // remove updated account from the account update list
        state.updatingAccounts = state.updatingAccounts.filter(
          (value) => value.id !== action.payload?.id
        );
      }
    );
    builder.addCase(
      removeARC0200AssetHoldingsThunk.pending,
      (state: IAccountsState, action) => {
        state.updatingAccounts = [
          // filter the unrelated updating account ids
          ...(state.updatingAccounts = state.updatingAccounts.filter(
            (value) => value.id !== action.meta.arg.accountId
          )),
          // re-add the account being updated
          {
            id: action.meta.arg.accountId,
            information: true,
            transactions: false,
          },
        ];
      }
    );
    builder.addCase(
      removeARC0200AssetHoldingsThunk.rejected,
      (state: IAccountsState, action) => {
        // remove updated account from the account update list
        state.updatingAccounts = state.updatingAccounts.filter(
          (value) => value.id !== action.meta.arg.accountId
        );
      }
    );
    /** save account name **/
    builder.addCase(
      saveAccountNameThunk.fulfilled,
      (state: IAccountsState, action: PayloadAction<IAccount | null>) => {
        if (action.payload) {
          state.items = upsertItemsById<IAccount>(state.items, [
            action.payload,
          ]);
        }

        state.saving = false;
      }
    );
    builder.addCase(saveAccountNameThunk.pending, (state: IAccountsState) => {
      state.saving = true;
    });
    builder.addCase(saveAccountNameThunk.rejected, (state: IAccountsState) => {
      state.saving = false;
    });
    /** save active account details **/
    builder.addCase(
      saveActiveAccountDetails.fulfilled,
      (
        state: IAccountsState,
        action: PayloadAction<IActiveAccountDetails | null>
      ) => {
        state.activeAccountDetails = action.payload;
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
