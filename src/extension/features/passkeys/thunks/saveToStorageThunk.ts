import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import PasskeyService from '@extension/services/PasskeyService';

// types
import type {
  IBaseAsyncThunkConfig,
  IMainRootState,
  IPasskeyCredential,
} from '@extension/types';

const saveToStorageThunk: AsyncThunk<
  IPasskeyCredential, // return
  IPasskeyCredential, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IPasskeyCredential,
  IPasskeyCredential,
  IBaseAsyncThunkConfig<IMainRootState>
>(ThunkEnum.SaveToStorage, async (credential) => {
  const passkeyService = new PasskeyService();

  return await passkeyService.saveToStorage(credential);
});

export default saveToStorageThunk;
