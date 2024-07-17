import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { PasswordLockThunkEnum } from '@extension/enums';

// messages
import { ProviderPasswordLockClearMessage } from '@common/messages';

// types
import type {
  IBaseAsyncThunkConfig,
  TEncryptionCredentials,
} from '@extension/types';

/**
 * Sends a message to the background service worker to clear the password lock alarm. This is either called when setting
 * the passkey/password (when the password lock screen is successful), or when the password lock is being disabled.
 */
const savePasswordLockThunk: AsyncThunk<
  TEncryptionCredentials | null, // return
  TEncryptionCredentials | null, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<
  TEncryptionCredentials | null,
  TEncryptionCredentials | null,
  IBaseAsyncThunkConfig
>(PasswordLockThunkEnum.SavePasswordLock, async (credentials) => {
  await browser.runtime.sendMessage(new ProviderPasswordLockClearMessage());

  return credentials;
});

export default savePasswordLockThunk;
