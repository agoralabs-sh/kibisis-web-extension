import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Enums
import { AccountsThunkEnum } from '../../../enums';

// Types
import { ILogger, IMainRootState } from '../../../types';

const stopPollingForAccountInformationThunk: AsyncThunk<
  void, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<void, undefined, { state: IMainRootState }>(
  AccountsThunkEnum.StopPollingForAccountInformation,
  (_, { getState }) => {
    const logger: ILogger = getState().application.logger;
    const pollingId: number | null = getState().accounts.pollingId;

    if (pollingId) {
      logger.debug(
        `${AccountsThunkEnum.StopPollingForAccountInformation}: stopped polling for account information`
      );

      window.clearInterval(pollingId);
    }
  }
);

export default stopPollingForAccountInformationThunk;
