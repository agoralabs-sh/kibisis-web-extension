import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// types
import type {
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';

const stopPollingForAccountsThunk: AsyncThunk<
  void, // return
  undefined, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  void,
  undefined,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(ThunkEnum.StopPollingForAccounts, (_, { getState }) => {
  const logger = getState().system.logger;
  const pollingId = getState().accounts.pollingId;

  if (pollingId) {
    logger.debug(
      `${ThunkEnum.StopPollingForAccounts}: stopped polling for account information and recent transactions`
    );

    window.clearInterval(pollingId);
  }
});

export default stopPollingForAccountsThunk;
