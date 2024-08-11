import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { SessionsThunkEnum } from '@extension/enums';

// services
import SessionService from '@extension/services/SessionService';

// types
import type {
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
  ISession,
} from '@extension/types';

const fetchSessionsThunk: AsyncThunk<
  ISession[], // return
  undefined, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  ISession[],
  undefined,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(SessionsThunkEnum.FetchSessions, async (_, { getState }) => {
  const logger = getState().system.logger;
  const sessionService = new SessionService({
    logger,
  });

  return await sessionService.getAll();
});

export default fetchSessionsThunk;
