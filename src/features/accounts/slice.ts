import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// Enums
import { StoreNameEnum } from '../../enums';

// Thunks
import { fetchAccounts } from './thunks';

// Types
import { IAccount } from '../../types';
import { IAccountsState } from './types';

// Utils
import { getInitialState } from './utils';

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
  },
  initialState: getInitialState(),
  name: StoreNameEnum.Accounts,
  reducers: {
    noop: () => {},
  },
});

export const reducer: Reducer = slice.reducer;
