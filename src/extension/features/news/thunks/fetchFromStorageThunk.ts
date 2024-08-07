import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import NewsService from '@extension/services/NewsService';

// types
import type { IBaseAsyncThunkConfig, IMainRootState } from '@extension/types';
import type { INewsItem } from '@extension/services/NewsService';

const fetchFromStorageThunk: AsyncThunk<
  INewsItem[], // return
  undefined, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  INewsItem[],
  undefined,
  IBaseAsyncThunkConfig<IMainRootState>
>(ThunkEnum.FetchFromStorage, async (_, { getState }) => {
  const logger = getState().system.logger;
  const newsService = new NewsService();

  logger.debug(
    `${ThunkEnum.FetchFromStorage}: fetching news items from storage`
  );

  return await newsService.getAll();
});

export default fetchFromStorageThunk;
