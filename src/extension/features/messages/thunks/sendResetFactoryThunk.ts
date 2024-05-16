import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { MessagesThunkEnum } from '@extension/enums';

// messages
import { ProviderFactoryResetMessage } from '@common/messages';

// types
import type { IBaseAsyncThunkConfig, IMainRootState } from '@extension/types';

const sendResetFactoryThunk: AsyncThunk<
  void, // return
  undefined, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<void, undefined, IBaseAsyncThunkConfig>(
  MessagesThunkEnum.SendFactoryReset,
  async () => {
    await browser.runtime.sendMessage(new ProviderFactoryResetMessage());
  }
);

export default sendResetFactoryThunk;
