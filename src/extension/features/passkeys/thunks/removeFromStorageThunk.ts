import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import PasskeyService from '@extension/services/PasskeyService';

// types
import type { IBaseAsyncThunkConfig } from '@extension/types';

const removeFromStorageThunk: AsyncThunk<
  void, // return
  void, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<void, void, IBaseAsyncThunkConfig>(
  ThunkEnum.RemoveFromStorage,
  async () => {
    const passkeyService = new PasskeyService();

    return await passkeyService.removeFromStorage();
  }
);

export default removeFromStorageThunk;
