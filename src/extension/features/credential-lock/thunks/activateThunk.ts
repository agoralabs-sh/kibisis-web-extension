import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// types
import type { IBaseAsyncThunkConfig, IMainRootState } from '@extension/types';

/**
 * Fetches the activated state. This just checks whether the credential lock alarm is active or not.
 */
const activateThunk: AsyncThunk<
  boolean, // return
  void, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<boolean, void, IBaseAsyncThunkConfig<IMainRootState>>(
  ThunkEnum.Activate,
  async (_, { getState }) => {
    const settings = getState().settings.security;

    // if the lock is not enabled or the duration is set to 0 ("never")
    return !(
      !settings.enableCredentialLock ||
      (settings.enableCredentialLock &&
        settings.credentialLockTimeoutDuration <= 0)
    );
  }
);

export default activateThunk;
