import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import SystemService from '@extension/services/SystemService';

// types
import { IBaseAsyncThunkConfig, ISystemInfo } from '@extension/types';

const fetchFromStorageThunk: AsyncThunk<
  ISystemInfo, // return
  undefined, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<ISystemInfo, undefined, IBaseAsyncThunkConfig>(
  ThunkEnum.FetchFromStorage,
  async () => {
    const systemService = new SystemService();
    let systemInfo = await systemService.get();

    // if there is no system info save a new one
    if (!systemInfo) {
      systemInfo = await systemService.save(
        SystemService.initializeDefaultSystem()
      );
    }

    return systemInfo;
  }
);

export default fetchFromStorageThunk;
