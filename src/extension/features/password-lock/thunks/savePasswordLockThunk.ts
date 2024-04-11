import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { PasswordLockThunkEnum } from '@extension/enums';

// messages
import { ProviderPasswordLockClearMessage } from '@common/messages';

// types
import { IBaseAsyncThunkConfig } from '@extension/types';

/**
 * Sends a message to the background service worker to clear the password lock alarm. This is either called when setting
 * the password (when the password lock screen is successful), or when the password lock is being disabled.
 */
const savePasswordLockThunk: AsyncThunk<
  string | null, // return
  string | null, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<string | null, string | null, IBaseAsyncThunkConfig>(
  PasswordLockThunkEnum.SavePasswordLock,
  async (password) => {
    await browser.runtime.sendMessage(new ProviderPasswordLockClearMessage());

    return password;
  }
);

export default savePasswordLockThunk;
