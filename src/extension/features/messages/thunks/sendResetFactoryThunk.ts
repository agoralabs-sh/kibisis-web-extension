import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { MessagesThunkEnum } from '@extension/enums';

// messages
import { InternalFactoryResetMessage } from '@common/messages';

// types
import { IMainRootState } from '@extension/types';

const sendResetFactoryThunk: AsyncThunk<
  void, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<void, undefined, { state: IMainRootState }>(
  MessagesThunkEnum.SendFactoryReset,
  async () => {
    await browser.runtime.sendMessage(new InternalFactoryResetMessage());
  }
);

export default sendResetFactoryThunk;
