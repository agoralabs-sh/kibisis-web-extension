import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// types
import { ILogger } from '@common/types';
import { IMainRootState } from '@extension/types';

const stopPollingForAccountsThunk: AsyncThunk<
  void, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<void, undefined, { state: IMainRootState }>(
  ThunkEnum.StopPollingForAccounts,
  (_, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const pollingId: number | null = getState().accounts.pollingId;

    if (pollingId) {
      logger.debug(
        `${ThunkEnum.StopPollingForAccounts}: stopped polling for account information and recent transactions`
      );

      window.clearInterval(pollingId);
    }
  }
);

export default stopPollingForAccountsThunk;
