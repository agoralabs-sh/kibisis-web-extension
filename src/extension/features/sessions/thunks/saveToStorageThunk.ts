import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// repositories
import SessionRepositoryService from '@extension/repositories/SessionRepositoryService';

// types
import type {
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
  ISession,
} from '@extension/types';

const saveToStorageThunk: AsyncThunk<
  ISession, // return
  ISession, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  ISession,
  ISession,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(ThunkEnum.SaveToStorage, async (session, { getState }) => {
  const logger = getState().system.logger;

  await new SessionRepositoryService().save(session);

  logger.debug(
    `${ThunkEnum.SaveToStorage}: saved session "${session.id}" to storage`
  );

  return session;
});

export default saveToStorageThunk;
