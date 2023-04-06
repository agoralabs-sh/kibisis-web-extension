import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// Enums
import { StoreNameEnum } from '../../enums';

// Thunks
import {
  fetchAccountsThunk,
  removeAccountThunk,
  setAccountThunk,
  startPollingForAccountInformationThunk,
  stopPollingForAccountInformationThunk,
  updateAccountInformationThunk,
} from './thunks';

// Types
import { IAccount } from '../../types';
import { IAccountsState } from './types';

// Utils
import { getInitialState, upsertAccount } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** Fetch accounts **/
    builder.addCase(
      fetchAccountsThunk.fulfilled,
      (state: IAccountsState, action: PayloadAction<IAccount[]>) => {
        state.items = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(fetchAccountsThunk.pending, (state: IAccountsState) => {
      state.fetching = true;
    });
    builder.addCase(fetchAccountsThunk.rejected, (state: IAccountsState) => {
      state.fetching = false;
    });
    /** Remove account **/
    builder.addCase(
      removeAccountThunk.fulfilled,
      (state: IAccountsState, action: PayloadAction<string>) => {
        state.items = state.items.filter(
          (value) => value.id !== action.payload
        ); // filter the accounts excluding the removed account
        state.saving = false;
      }
    );
    builder.addCase(removeAccountThunk.pending, (state: IAccountsState) => {
      state.saving = true;
    });
    builder.addCase(removeAccountThunk.rejected, (state: IAccountsState) => {
      state.saving = false;
    });
    /** Set account **/
    builder.addCase(
      setAccountThunk.fulfilled,
      (state: IAccountsState, action: PayloadAction<IAccount>) => {
        state.items = upsertAccount(state.items, action.payload);
        state.saving = false;
      }
    );
    builder.addCase(setAccountThunk.pending, (state: IAccountsState) => {
      state.saving = true;
    });
    builder.addCase(setAccountThunk.rejected, (state: IAccountsState) => {
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
