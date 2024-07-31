import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import PasskeyService from '@extension/services/PasskeyService';

// types
import type {
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
  IPasskeyCredential,
} from '@extension/types';

const fetchFromStorageThunk: AsyncThunk<
  IPasskeyCredential | null, // return
  void, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  IPasskeyCredential | null,
  void,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(ThunkEnum.FetchFromStorage, async () => {
  const passkeyService = new PasskeyService();

  return await passkeyService.fetchFromStorage();
});

export default fetchFromStorageThunk;
