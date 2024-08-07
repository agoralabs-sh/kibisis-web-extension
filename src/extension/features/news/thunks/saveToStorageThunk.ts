import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import NewsService from '@extension/services/NewsService';

// types
import type { INewsItem } from '@extension/services/NewsService';
import type { IBaseAsyncThunkConfig, IMainRootState } from '@extension/types';

const saveToStorageThunk: AsyncThunk<
  INewsItem[], // return
  INewsItem, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  INewsItem[],
  INewsItem,
  IBaseAsyncThunkConfig<IMainRootState>
>(ThunkEnum.SaveToStorage, async (item, { getState }) => {
  const logger = getState().system.logger;
  const newsService = new NewsService();

  logger.debug(
    `${ThunkEnum.SaveToStorage}: saving news item "${item.name}" to storage`
  );

  // save the item
  await newsService.save(item);

  return await newsService.getAll();
});

export default saveToStorageThunk;
