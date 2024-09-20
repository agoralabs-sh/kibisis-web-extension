import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// repositories
import SystemInfoRepositoryService from '@extension/repositories/SystemInfoRepositoryService';

// types
import type {
  IBaseRootState,
  IBaseAsyncThunkConfig,
  ISystemInfo,
} from '@extension/types';

const fetchFromStorageThunk: AsyncThunk<
  ISystemInfo, // return
  undefined, // args
  IBaseAsyncThunkConfig<IBaseRootState>
> = createAsyncThunk<
  ISystemInfo,
  undefined,
  IBaseAsyncThunkConfig<IBaseRootState>
>(ThunkEnum.FetchFromStorage, async () => {
  const systemInfoService = new SystemInfoRepositoryService();
  let systemInfo = await systemInfoService.fetch();

  // if there is no system info save a new one
  if (!systemInfo) {
    systemInfo = await systemInfoService.save(
      SystemInfoRepositoryService.initializeDefaultSystem()
    );
  }

  return systemInfo;
});

export default fetchFromStorageThunk;
