import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import CredentialLockService from '@extension/services/CredentialLockService';

// types
import type { IBaseAsyncThunkConfig, IMainRootState } from '@extension/types';

/**
 * If the alarm is active, it restarts it with the new duration.
 */
const updateDurationThunk: AsyncThunk<
  void, // return
  number, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<void, number, IBaseAsyncThunkConfig<IMainRootState>>(
  ThunkEnum.UpdateDuration,
  async (duration, { getState, rejectWithValue }) => {
    const logger = getState().system.logger;
    const credentialLockService = new CredentialLockService({
      logger,
    });
    const credentialLockAlarm = await credentialLockService.getAlarm();

    // if there is no active alarm or the new duration is set to 0 ("never"), don't restart the alarm
    if (!credentialLockAlarm || duration <= 0) {
      return;
    }

    // if there is an alarm, restart it with the new duration
    await credentialLockService.restartAlarm(duration);

    logger.debug(`${ThunkEnum.Disable}: restarted credential lock alarm`);
  }
);

export default updateDurationThunk;
