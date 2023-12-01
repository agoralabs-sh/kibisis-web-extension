import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { NetworksThunkEnum } from '@extension/enums';

// types
import { ILogger } from '@common/types';
import { IMainRootState } from '@extension/types';

const stopPollingForTransactionsParamsThunk: AsyncThunk<
  void, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<void, undefined, { state: IMainRootState }>(
  NetworksThunkEnum.StopPollingForTransactionParams,
  (_, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const pollingId: number | null = getState().accounts.pollingId;

    if (pollingId) {
      logger.debug(
        `${NetworksThunkEnum.StopPollingForTransactionParams}: stopped polling for network transaction params`
      );

      window.clearInterval(pollingId);
    }
  }
);

export default stopPollingForTransactionsParamsThunk;
