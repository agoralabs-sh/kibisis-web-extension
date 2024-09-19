import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { ACCOUNT_INFORMATION_REFRESH_INTERVAL } from '@extension/constants';

// enums
import { ThunkEnum } from '../enums';

// thunks
import updateAccountsThunk from './updateAccountsThunk';

// types
import type {
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';

const startPollingForAccountsThunk: AsyncThunk<
  number, // return
  undefined, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  number,
  undefined,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(ThunkEnum.StartPollingForAccounts, (_, { dispatch, getState }) => {
  const logger = getState().system.logger;

  logger.debug(
    `${ThunkEnum.StartPollingForAccounts}: started polling for account information and recent transactions`
  );

  return window.setInterval(() => {
    const accounts = getState().accounts.items;

    dispatch(
      updateAccountsThunk({
        accountIDs: accounts.map(({ id }) => id),
        informationOnly: false, // get account information
        refreshTransactions: true, // get any new transactions
      })
    );
  }, ACCOUNT_INFORMATION_REFRESH_INTERVAL); // update every 2 minutes
});

export default startPollingForAccountsThunk;
