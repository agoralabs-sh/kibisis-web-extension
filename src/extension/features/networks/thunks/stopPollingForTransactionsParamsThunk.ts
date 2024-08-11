import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// types
import { ILogger } from '@common/types';
import { IMainRootState } from '@extension/types';

const stopPollingForTransactionsParamsThunk: AsyncThunk<
  void, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<void, undefined, { state: IMainRootState }>(
  ThunkEnum.StopPollingForTransactionParams,
  (_, { getState }) => {
    const logger = getState().system.logger;
    const pollingId = getState().accounts.pollingId;

    if (pollingId) {
      logger.debug(
        `${ThunkEnum.StopPollingForTransactionParams}: stopped polling for network transaction params`
      );

      window.clearInterval(pollingId);
    }
  }
);

export default stopPollingForTransactionsParamsThunk;
