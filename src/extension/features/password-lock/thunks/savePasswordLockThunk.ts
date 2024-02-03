import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { PasswordLockThunkEnum } from '@extension/enums';

// messages
import { InternalPasswordLockClearedMessage } from '@common/messages';

// types
import { IBaseAsyncThunkConfig } from '@extension/types';

const savePasswordLockThunk: AsyncThunk<
  string, // return
  string, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<string, string, IBaseAsyncThunkConfig>(
  PasswordLockThunkEnum.SavePasswordLock,
  async (password) => {
    await browser.runtime.sendMessage(new InternalPasswordLockClearedMessage());

    return password;
  }
);

export default savePasswordLockThunk;
