import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { SettingsThunkEnum } from '@extension/enums';

// services
import SettingsService from '@extension/services/SettingsService';

// types
import { ILogger } from '@common/types';
import { IMainRootState, ISettings } from '@extension/types';

const fetchSettingsFromStorage: AsyncThunk<
  ISettings, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<ISettings, undefined, { state: IMainRootState }>(
  SettingsThunkEnum.FetchSettingsFromStorage,
  async (_, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const settingsService: SettingsService = new SettingsService({
      logger,
    });

    return await settingsService.getAll();
  }
);

export default fetchSettingsFromStorage;
