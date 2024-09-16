import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import SettingsService from '@extension/services/SettingsService';

// types
import type {
  IBaseAsyncThunkConfig,
  IBaseRootState,
  ISettings,
} from '@extension/types';

const fetchFromStorageThunk: AsyncThunk<
  ISettings, // return
  undefined, // args
  IBaseAsyncThunkConfig<IBaseRootState>
> = createAsyncThunk<
  ISettings,
  undefined,
  IBaseAsyncThunkConfig<IBaseRootState>
>(ThunkEnum.FetchFromStorage, async (_, { getState }) => {
  const logger = getState().system.logger;
  const settingsService = new SettingsService({
    logger,
  });

  return await settingsService.fetchFromStorage();
});

export default fetchFromStorageThunk;
