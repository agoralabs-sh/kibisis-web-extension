import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// constants
import { PASSWORD_LOCK_ALARM } from '@extension/constants';

// enums
import { PasswordLockThunkEnum } from '@extension/enums';

// types
import { ILogger } from '@common/types';
import { IBaseAsyncThunkConfig } from '@extension/types';

const savePasswordLockThunk: AsyncThunk<
  string, // return
  string, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<string, string, IBaseAsyncThunkConfig>(
  PasswordLockThunkEnum.SavePasswordLock,
  async (password, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const timeout: number =
      getState().settings.security.passwordLockTimeoutDuration;
    const delayInMinutes: number = timeout * 60000; // convert the milliseconds to minutes

    // create an alarm
    browser.alarms.create(PASSWORD_LOCK_ALARM, {
      delayInMinutes,
    });

    logger.debug(
      `${PasswordLockThunkEnum.SavePasswordLock}: add new alarm to expire in "${delayInMinutes}" minutes(s)`
    );

    return password;
  }
);

export default savePasswordLockThunk;
