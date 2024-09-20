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
} from '@extension/types';

const removeAllFromStorageThunk: AsyncThunk<
  void, // return
  undefined, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  void,
  undefined,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(ThunkEnum.RemoveAllFromStorage, async (_, { getState }) => {
  const logger = getState().system.logger;

  await new SessionRepositoryService().removeAll();

  logger.debug(
    `${ThunkEnum.RemoveAllFromStorage}: cleared all sessions from storage`
  );
});

export default removeAllFromStorageThunk;
