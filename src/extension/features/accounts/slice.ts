import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import {
  addARC0200AssetHoldingsThunk,
  addStandardAssetHoldingsThunk,
  fetchAccountsFromStorageThunk,
  removeAccountByIdThunk,
  removeARC0200AssetHoldingsThunk,
  removeStandardAssetHoldingsThunk,
  saveAccountNameThunk,
  saveActiveAccountDetails,
  saveNewAccountThunk,
  startPollingForAccountsThunk,
  stopPollingForAccountsThunk,
  updateAccountsThunk,
} from './thunks';

// types
import type {
  IAccountWithExtendedProps,
  IActiveAccountDetails,
} from '@extension/types';
import type {
  IFetchAccountsFromStorageResult,
  IState,
  IUpdateAssetHoldingsResult,
  IUpdateStandardAssetHoldingsResult,
} from './types';

// utils
import upsertItemsById from '@extension/utils/upsertItemsById';
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** add arc-0200 asset holdings **/
    builder.addCase(
      addARC0200AssetHoldingsThunk.fulfilled,
      (state: IState, action: PayloadAction<IUpdateAssetHoldingsResult>) => {
        state.items = state.items.map((value) =>
          value.id === action.payload?.account.id
            ? action.payload.account
            : value
        );
        // remove updated account from the account update list
        state.updatingAccounts = state.updatingAccounts.filter(
          (value) => value.id !== action.payload?.account.id
        );
      }
    );
    builder.addCase(
      addARC0200AssetHoldingsThunk.pending,
      (state: IState, action) => {
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
      (state: IState, action) => {
        // remove updated account from the account update list
        state.updatingAccounts = state.updatingAccounts.filter(
          (value) => value.id !== action.meta.arg.accountId
        );
      }
    );
    /** add standard asset holdings **/
    builder.addCase(
      addStandardAssetHoldingsThunk.fulfilled,
      (
        state: IState,
        action: PayloadAction<IUpdateStandardAssetHoldingsResult>
      ) => {
        state.items = state.items.map((value) =>
          value.id === action.payload?.account.id
            ? action.payload.account
            : value
        );
        // remove updated account from the account update list
        state.updatingAccounts = state.updatingAccounts.filter(
          (value) => value.id !== action.payload?.account.id
        );
      }
    );
    builder.addCase(
      addStandardAssetHoldingsThunk.pending,
      (state: IState, action) => {
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
      addStandardAssetHoldingsThunk.rejected,
      (state: IState, action) => {
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
        state: IState,
        action: PayloadAction<IFetchAccountsFromStorageResult>
      ) => {
        state.activeAccountDetails = action.payload.activeAccountDetails;
        state.items = action.payload.accounts;
        state.fetching = false;
      }
    );
    builder.addCase(fetchAccountsFromStorageThunk.pending, (state: IState) => {
      state.fetching = true;
    });
    builder.addCase(fetchAccountsFromStorageThunk.rejected, (state: IState) => {
      state.fetching = false;
    });
    /** remove account by id **/
    builder.addCase(
      removeAccountByIdThunk.fulfilled,
      (state: IState, action: PayloadAction<string>) => {
        state.items = state.items.filter(
          (value) => value.id !== action.payload
        ); // filter the accounts excluding the removed account
        state.saving = false;
      }
    );
    builder.addCase(removeAccountByIdThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(removeAccountByIdThunk.rejected, (state: IState) => {
      state.saving = false;
    });
    /** remove arc-0200 asset holdings **/
    builder.addCase(
      removeARC0200AssetHoldingsThunk.fulfilled,
      (state: IState, action: PayloadAction<IUpdateAssetHoldingsResult>) => {
        state.items = state.items.map((value) =>
          value.id === action.payload?.account.id
            ? action.payload.account
            : value
        );
        // remove updated account from the account update list
        state.updatingAccounts = state.updatingAccounts.filter(
          (value) => value.id !== action.payload?.account.id
        );
      }
    );
    builder.addCase(
      removeARC0200AssetHoldingsThunk.pending,
      (state: IState, action) => {
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
      (state: IState, action) => {
        // remove updated account from the account update list
        state.updatingAccounts = state.updatingAccounts.filter(
          (value) => value.id !== action.meta.arg.accountId
        );
      }
    );
    /** remove standard asset holdings **/
    builder.addCase(
      removeStandardAssetHoldingsThunk.fulfilled,
      (
        state: IState,
        action: PayloadAction<IUpdateStandardAssetHoldingsResult>
      ) => {
        state.items = state.items.map((value) =>
          value.id === action.payload?.account.id
            ? action.payload.account
            : value
        );
        // remove updated account from the account update list
        state.updatingAccounts = state.updatingAccounts.filter(
          (value) => value.id !== action.payload?.account.id
        );
      }
    );
    builder.addCase(
      removeStandardAssetHoldingsThunk.pending,
      (state: IState, action) => {
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
      removeStandardAssetHoldingsThunk.rejected,
      (state: IState, action) => {
        // remove updated account from the account update list
        state.updatingAccounts = state.updatingAccounts.filter(
          (value) => value.id !== action.meta.arg.accountId
        );
      }
    );
    /** save account name **/
    builder.addCase(
      saveAccountNameThunk.fulfilled,
      (
        state: IState,
        action: PayloadAction<IAccountWithExtendedProps | null>
      ) => {
        if (action.payload) {
          state.items = upsertItemsById<IAccountWithExtendedProps>(
            state.items,
            [action.payload]
          );
        }

        state.saving = false;
      }
    );
    builder.addCase(saveAccountNameThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(saveAccountNameThunk.rejected, (state: IState) => {
      state.saving = false;
    });
    /** save active account details **/
    builder.addCase(
      saveActiveAccountDetails.fulfilled,
      (state: IState, action: PayloadAction<IActiveAccountDetails | null>) => {
        state.activeAccountDetails = action.payload;
      }
    );
    /** save new account **/
    builder.addCase(
      saveNewAccountThunk.fulfilled,
      (state: IState, action: PayloadAction<IAccountWithExtendedProps>) => {
        if (action.payload) {
          state.items = upsertItemsById<IAccountWithExtendedProps>(
            state.items,
            [action.payload]
          );
        }

        state.saving = false;
      }
    );
    builder.addCase(saveNewAccountThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(saveNewAccountThunk.rejected, (state: IState) => {
      state.saving = false;
    });
    /** start polling for account information **/
    builder.addCase(
      startPollingForAccountsThunk.fulfilled,
      (state: IState, action: PayloadAction<number>) => {
        state.pollingId = action.payload;
      }
    );
    /** stop polling for account information **/
    builder.addCase(stopPollingForAccountsThunk.fulfilled, (state: IState) => {
      state.pollingId = null;
    });
    /** update accounts **/
    builder.addCase(
      updateAccountsThunk.fulfilled,
      (state: IState, action: PayloadAction<IAccountWithExtendedProps[]>) => {
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
    builder.addCase(updateAccountsThunk.pending, (state: IState, action) => {
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
    });
    builder.addCase(updateAccountsThunk.rejected, (state: IState, action) => {
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
    });
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
