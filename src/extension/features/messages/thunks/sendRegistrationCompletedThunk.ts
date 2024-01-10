import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { MessagesThunkEnum } from '@extension/enums';

// messages
import { InternalRegistrationCompletedMessage } from '@common/messages';

// types
import { IMainRootState } from '@extension/types';

const sendRegistrationCompletedThunk: AsyncThunk<
  void, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<void, undefined, { state: IMainRootState }>(
  MessagesThunkEnum.SendRegistrationCompleted,
  async () => {
    // send the message
    await browser.runtime.sendMessage(
      new InternalRegistrationCompletedMessage()
    );
  }
);

export default sendRegistrationCompletedThunk;
