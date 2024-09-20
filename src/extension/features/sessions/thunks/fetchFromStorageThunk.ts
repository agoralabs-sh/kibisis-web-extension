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

const fetchFromStorageThunk: AsyncThunk<
  ISession[], // return
  undefined, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  ISession[],
  undefined,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(ThunkEnum.FetchFromStorage, async (_, { getState }) => {
  return await new SessionRepositoryService().fetchAll();
});

export default fetchFromStorageThunk;
