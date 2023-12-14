import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { ACCOUNT_INFORMATION_REFRESH_INTERVAL } from '@extension/constants';

// enums
import { AccountsThunkEnum } from '@extension/enums';

// thunks
import updateAccountsThunk from './updateAccountsThunk';

// types
import { ILogger } from '@common/types';
import { IMainRootState } from '@extension/types';

const startPollingForAccountsThunk: AsyncThunk<
  number, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<number, undefined, { state: IMainRootState }>(
  AccountsThunkEnum.StartPollingForAccounts,
  (_, { dispatch, getState }) => {
    const logger: ILogger = getState().system.logger;

    logger.debug(
      `${AccountsThunkEnum.StartPollingForAccounts}: started polling for account information and recent transactions`
    );

    return window.setInterval(
      () =>
        dispatch(
          updateAccountsThunk({
            informationOnly: false, // get account information
            refreshTransactions: true, // get any new transactions
          })
        ),
      ACCOUNT_INFORMATION_REFRESH_INTERVAL
    ); // update every 2 minutes
  }
);

export default startPollingForAccountsThunk;
