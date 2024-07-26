import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import PasskeyService from '@extension/services/PasskeyService';

// types
import type {
  IBaseAsyncThunkConfig,
  IPasskeyCredential,
} from '@extension/types';

const fetchFromStorageThunk: AsyncThunk<
  IPasskeyCredential | null, // return
  void, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<IPasskeyCredential | null, void, IBaseAsyncThunkConfig>(
  ThunkEnum.FetchFromStorage,
  async () => {
    const passkeyService = new PasskeyService();

    return await passkeyService.fetchFromStorage();
  }
);

export default fetchFromStorageThunk;
