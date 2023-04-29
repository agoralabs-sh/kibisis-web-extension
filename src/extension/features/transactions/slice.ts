import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

// Enums
import { StoreNameEnum } from '@extension/enums';

// Thunks
import { updateAccountTransactionsThunk } from './thunks';

// Types
import { ITransactionsState, IUpdateAccountTransactionsResult } from './types';

// Utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** Update account transactions **/
    builder.addCase(
      updateAccountTransactionsThunk.fulfilled,
      (
        state: ITransactionsState,
        action: PayloadAction<IUpdateAccountTransactionsResult | null>
      ) => {
        let accountTransactionsIndex: number;

        if (action.payload) {
          accountTransactionsIndex = state.items.findIndex(
            (value) => value.accountId === action.payload?.accountId
          );

          // if no transactions exist for this account, create a new one
          if (accountTransactionsIndex < 0) {
            state.items = [
              ...state.items,
              {
                accountId: action.payload.accountId,
                fetching: false,
                next: action.payload.next,
                transactions: action.payload.transactions,
              },
            ];

            return;
          }

          // otherwise append the transactions
          state.items = state.items.map((value, index) =>
            index === accountTransactionsIndex
              ? {
                  ...value,
                  fetching: false,
                  next: action.payload?.next || null,
                  transactions: [
                    ...value.transactions,
                    ...(action.payload ? action.payload.transactions : []),
                  ],
                }
              : value
          );
        }
      }
    );
    builder.addCase(
      updateAccountTransactionsThunk.pending,
      (state: ITransactionsState, action) => {
        state.items = state.items.map((value) =>
          value.accountId === action.meta.arg
            ? {
                ...value,
                fetching: true,
              }
            : value
        );
      }
    );
    builder.addCase(
      updateAccountTransactionsThunk.rejected,
      (state: ITransactionsState, action) => {
        state.items = state.items.map((value) =>
          value.accountId === action.meta.arg
            ? {
                ...value,
                fetching: false,
              }
            : value
        );
      }
    );
  },
  initialState: getInitialState(),
  name: StoreNameEnum.Transactions,
  reducers: {
    noop: () => {
      return;
    },
  },
});

export const reducer: Reducer = slice.reducer;
