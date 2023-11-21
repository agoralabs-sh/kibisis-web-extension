import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { SessionsThunkEnum } from '@extension/enums';

// servcies
import { SessionService } from '@extension/services';

// types
import { ILogger } from '@common/types';
import { IMainRootState, ISession } from '@extension/types';

const fetchSessionsThunk: AsyncThunk<
  ISession[], // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<ISession[], undefined, { state: IMainRootState }>(
  SessionsThunkEnum.FetchSessions,
  async (_, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const sessionService: SessionService = new SessionService({
      logger,
    });

    return await sessionService.getAll();
  }
);

export default fetchSessionsThunk;
