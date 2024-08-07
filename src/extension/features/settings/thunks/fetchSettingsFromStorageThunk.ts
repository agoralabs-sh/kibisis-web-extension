import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { SettingsThunkEnum } from '@extension/enums';

// services
import SettingsService from '@extension/services/SettingsService';

// types
import type {
  IBaseAsyncThunkConfig,
  IBaseRootState,
  ISettings,
} from '@extension/types';

const fetchSettingsFromStorageThunk: AsyncThunk<
  ISettings, // return
  undefined, // args
  IBaseAsyncThunkConfig<IBaseRootState>
> = createAsyncThunk<
  ISettings,
  undefined,
  IBaseAsyncThunkConfig<IBaseRootState>
>(SettingsThunkEnum.FetchSettingsFromStorage, async (_, { getState }) => {
  const logger = getState().system.logger;
  const settingsService = new SettingsService({
    logger,
  });

  return await settingsService.getAll();
});

export default fetchSettingsFromStorageThunk;
