import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Enums
import { AccountsThunkEnum } from '@extension/enums';

// Types
import { ILogger } from '@common/types';
import { IMainRootState } from '@extension/types';

const stopPollingForAccountInformationThunk: AsyncThunk<
  void, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<void, undefined, { state: IMainRootState }>(
  AccountsThunkEnum.StopPollingForAccountInformation,
  (_, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const pollingId: number | null = getState().accounts.pollingId;

    if (pollingId) {
      logger.debug(
        `${stopPollingForAccountInformationThunk.name}: stopped polling for account information`
      );

      window.clearInterval(pollingId);
    }
  }
);

export default stopPollingForAccountInformationThunk;
