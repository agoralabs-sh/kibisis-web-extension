import { createSlice } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// thunks
import {
  addARC0200AssetHoldingsThunk,
  addStandardAssetHoldingsThunk,
  fetchAccountsFromStorageThunk,
  removeAccountByIdThunk,
  removeARC0200AssetHoldingsThunk,
  removeStandardAssetHoldingsThunk,
  saveAccountDetailsThunk,
  saveAccountsThunk,
  saveActiveAccountDetails,
  saveNewAccountsThunk,
  saveNewWatchAccountThunk,
  startPollingForAccountsThunk,
  stopPollingForAccountsThunk,
  updateAccountsThunk,
} from './thunks';

// types
import type { IAccountWithExtendedProps } from '@extension/types';
import type { IState } from './types';

// utils
import upsertItemsById from '@extension/utils/upsertItemsById';
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** add arc-0200 asset holdings **/
    builder.addCase(
      addARC0200AssetHoldingsThunk.fulfilled,
      (state: IState, action) => {
        state.items = state.items.map((value) =>
          value.id === action.payload?.account.id
            ? action.payload.account
            : value
        );
        // remove the update request
        state.updateRequests = state.updateRequests.filter(
          ({ requestID }) => requestID !== action.meta.requestId
        );
      }
    );
    builder.addCase(
      addARC0200AssetHoldingsThunk.pending,
      (state: IState, action) => {
        // add an update request
        state.updateRequests = [
          ...state.updateRequests,
          {
            accountIDs: [action.meta.arg.accountId],
            requestID: action.meta.requestId,
            information: true,
            transactions: false,
          },
        ];
      }
    );
    builder.addCase(
      addARC0200AssetHoldingsThunk.rejected,
      (state: IState, action) => {
        // remove the update request
        state.updateRequests = state.updateRequests.filter(
          ({ requestID }) => requestID !== action.meta.requestId
        );
      }
    );
    /** add standard asset holdings **/
    builder.addCase(
      addStandardAssetHoldingsThunk.fulfilled,
      (state: IState, action) => {
        state.items = state.items.map((value) =>
          value.id === action.payload?.account.id
            ? action.payload.account
            : value
        );
        // remove the update request
        state.updateRequests = state.updateRequests.filter(
          ({ requestID }) => requestID !== action.meta.requestId
        );
      }
    );
    builder.addCase(
      addStandardAssetHoldingsThunk.pending,
      (state: IState, action) => {
        // add an update request
        state.updateRequests = [
          ...state.updateRequests,
          {
            accountIDs: [action.meta.arg.accountId],
            requestID: action.meta.requestId,
            information: true,
            transactions: false,
          },
        ];
      }
    );
    builder.addCase(
      addStandardAssetHoldingsThunk.rejected,
      (state: IState, action) => {
        // remove the update request
        state.updateRequests = state.updateRequests.filter(
          ({ requestID }) => requestID !== action.meta.requestId
        );
      }
    );
    /** fetch accounts from storage **/
    builder.addCase(
      fetchAccountsFromStorageThunk.fulfilled,
      (state: IState, action) => {
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
      (state: IState, action) => {
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
      (state: IState, action) => {
        state.items = state.items.map((value) =>
          value.id === action.payload?.account.id
            ? action.payload.account
            : value
        );
        // remove the update request
        state.updateRequests = state.updateRequests.filter(
          ({ requestID }) => requestID !== action.meta.requestId
        );
      }
    );
    builder.addCase(
      removeARC0200AssetHoldingsThunk.pending,
      (state: IState, action) => {
        // add an update request
        state.updateRequests = [
          ...state.updateRequests,
          {
            accountIDs: [action.meta.arg.accountId],
            requestID: action.meta.requestId,
            information: true,
            transactions: false,
          },
        ];
      }
    );
    builder.addCase(
      removeARC0200AssetHoldingsThunk.rejected,
      (state: IState, action) => {
        // remove the update request
        state.updateRequests = state.updateRequests.filter(
          ({ requestID }) => requestID !== action.meta.requestId
        );
      }
    );
    /** remove standard asset holdings **/
    builder.addCase(
      removeStandardAssetHoldingsThunk.fulfilled,
      (state: IState, action) => {
        state.items = state.items.map((value) =>
          value.id === action.payload?.account.id
            ? action.payload.account
            : value
        );
        // remove the update request
        state.updateRequests = state.updateRequests.filter(
          ({ requestID }) => requestID !== action.meta.requestId
        );
      }
    );
    builder.addCase(
      removeStandardAssetHoldingsThunk.pending,
      (state: IState, action) => {
        // add an update request
        state.updateRequests = [
          ...state.updateRequests,
          {
            accountIDs: [action.meta.arg.accountId],
            requestID: action.meta.requestId,
            information: true,
            transactions: false,
          },
        ];
      }
    );
    builder.addCase(
      removeStandardAssetHoldingsThunk.rejected,
      (state: IState, action) => {
        // remove the update request
        state.updateRequests = state.updateRequests.filter(
          ({ requestID }) => requestID !== action.meta.requestId
        );
      }
    );
    /** save account details **/
    builder.addCase(
      saveAccountDetailsThunk.fulfilled,
      (state: IState, action) => {
        if (action.payload) {
          state.items = upsertItemsById<IAccountWithExtendedProps>(
            state.items,
            [action.payload]
          );
        }

        state.saving = false;
      }
    );
    builder.addCase(saveAccountDetailsThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(saveAccountDetailsThunk.rejected, (state: IState) => {
      state.saving = false;
    });
    /** save accounts **/
    builder.addCase(saveAccountsThunk.fulfilled, (state: IState, action) => {
      state.items = AccountRepository.sort<IAccountWithExtendedProps>(
        upsertItemsById<IAccountWithExtendedProps>(state.items, action.payload)
      );
      state.saving = false;
    });
    builder.addCase(saveAccountsThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(saveAccountsThunk.rejected, (state: IState) => {
      state.saving = false;
    });
    /** save active account details **/
    builder.addCase(
      saveActiveAccountDetails.fulfilled,
      (state: IState, action) => {
        state.activeAccountDetails = action.payload;
      }
    );
    /** save new accounts **/
    builder.addCase(saveNewAccountsThunk.fulfilled, (state: IState, action) => {
      if (action.payload) {
        state.items = upsertItemsById<IAccountWithExtendedProps>(
          state.items,
          action.payload
        );
      }

      state.saving = false;
    });
    builder.addCase(saveNewAccountsThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(saveNewAccountsThunk.rejected, (state: IState) => {
      state.saving = false;
    });
    /** save new watch account **/
    builder.addCase(
      saveNewWatchAccountThunk.fulfilled,
      (state: IState, action) => {
        if (action.payload) {
          state.items = upsertItemsById<IAccountWithExtendedProps>(
            state.items,
            [action.payload]
          );
        }

        state.saving = false;
      }
    );
    builder.addCase(saveNewWatchAccountThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(saveNewWatchAccountThunk.rejected, (state: IState) => {
      state.saving = false;
    });
    /** start polling for account information **/
    builder.addCase(
      startPollingForAccountsThunk.fulfilled,
      (state: IState, action) => {
        state.pollingId = action.payload;
      }
    );
    /** stop polling for account information **/
    builder.addCase(stopPollingForAccountsThunk.fulfilled, (state: IState) => {
      state.pollingId = null;
    });
    /** update accounts **/
    builder.addCase(updateAccountsThunk.fulfilled, (state: IState, action) => {
      // update the updated accounts
      state.items = state.items.map(
        (account) =>
          action.payload.find((value) => value.id === account.id) || account
      );
      // remove the update request
      state.updateRequests = state.updateRequests.filter(
        ({ requestID }) => requestID !== action.meta.requestId
      );
    });
    builder.addCase(updateAccountsThunk.pending, (state: IState, action) => {
      // add an update request
      state.updateRequests = [
        ...state.updateRequests,
        {
          accountIDs: action.meta.arg.accountIDs,
          information: action.meta.arg.information || true,
          requestID: action.meta.requestId,
          transactions: action.meta.arg.transactions || true,
        },
      ];
    });
    builder.addCase(updateAccountsThunk.rejected, (state: IState, action) => {
      // remove the update request
      state.updateRequests = state.updateRequests.filter(
        ({ requestID }) => requestID !== action.meta.requestId
      );
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

export const reducer = slice.reducer;
