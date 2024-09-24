import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// repositories
import SessionRepository from '@extension/repositories/SessionRepository';

// types
import type {
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
  ISession,
} from '@extension/types';

const fetchFromStorageThunk: AsyncThunk<
  ISession[], // return
  undefined, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  ISession[],
  undefined,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(ThunkEnum.FetchFromStorage, async () => {
  return await new SessionRepository().fetchAll();
});

export default fetchFromStorageThunk;
