import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// Enums
import { StoreNameEnum } from '../../enums';

// Thunks
import { fetchAccounts, removeAccount, setAccount } from './thunks';

// Types
import { IAccount } from '../../types';
import { IAccountsState } from './types';

// Utils
import { getInitialState, upsertAccount } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** Fetch accounts **/
    builder.addCase(
      fetchAccounts.fulfilled,
      (state: IAccountsState, action: PayloadAction<IAccount[]>) => {
        state.items = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(fetchAccounts.pending, (state: IAccountsState) => {
      state.fetching = true;
    });
    builder.addCase(fetchAccounts.rejected, (state: IAccountsState) => {
      state.fetching = false;
    });
    /** Remove account **/
    builder.addCase(
      removeAccount.fulfilled,
      (state: IAccountsState, action: PayloadAction<string>) => {
        state.items = state.items.filter(
          (value) => value.id !== action.payload
        ); // filter the accounts excluding the removed account
        state.saving = false;
      }
    );
    builder.addCase(removeAccount.pending, (state: IAccountsState) => {
      state.saving = true;
    });
    builder.addCase(removeAccount.rejected, (state: IAccountsState) => {
      state.saving = false;
    });
    /** Set account **/
    builder.addCase(
      setAccount.fulfilled,
      (state: IAccountsState, action: PayloadAction<IAccount>) => {
        state.items = upsertAccount(state.items, action.payload);
        state.saving = false;
      }
    );
    builder.addCase(setAccount.pending, (state: IAccountsState) => {
      state.saving = true;
    });
    builder.addCase(setAccount.rejected, (state: IAccountsState) => {
      state.saving = false;
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
