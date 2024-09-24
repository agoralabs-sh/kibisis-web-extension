import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// repositories
import SettingsRepository from '@extension/repositories/SettingsRepository';

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
>(ThunkEnum.FetchFromStorage, async () => {
  return await new SettingsRepository().fetch();
});

export default fetchFromStorageThunk;
