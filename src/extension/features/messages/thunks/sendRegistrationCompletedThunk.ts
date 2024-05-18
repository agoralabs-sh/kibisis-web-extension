import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { MessagesThunkEnum } from '@extension/enums';

// messages
import { ProviderRegistrationCompletedMessage } from '@common/messages';

// types
import type { IBaseAsyncThunkConfig } from '@extension/types';

const sendRegistrationCompletedThunk: AsyncThunk<
  void, // return
  undefined, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<void, undefined, IBaseAsyncThunkConfig>(
  MessagesThunkEnum.SendRegistrationCompleted,
  async () => {
    // send the message
    await browser.runtime.sendMessage(
      new ProviderRegistrationCompletedMessage()
    );
  }
);

export default sendRegistrationCompletedThunk;
