import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// types
import type {
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';

// utils
import isCredentialLockActive from '@extension/utils/isCredentialLockActive';

/**
 * Fetches whether the credential lock is active or not.
 */
const fetchActiveThunk: AsyncThunk<
  boolean, // return
  undefined, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  boolean,
  undefined,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(ThunkEnum.FetchActive, async (_, { getState }) => {
  const logger = getState().system.logger;

  return await isCredentialLockActive({ logger });
});

export default fetchActiveThunk;
