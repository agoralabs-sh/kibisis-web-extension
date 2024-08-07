import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { MessagesThunkEnum } from '@extension/enums';

// messages
import { ProviderRegistrationCompletedMessage } from '@common/messages';

// types
import type {
  IBaseAsyncThunkConfig,
  IRegistrationRootState,
} from '@extension/types';

const sendRegistrationCompletedThunk: AsyncThunk<
  void, // return
  undefined, // args
  IBaseAsyncThunkConfig<IRegistrationRootState>
> = createAsyncThunk<
  void,
  undefined,
  IBaseAsyncThunkConfig<IRegistrationRootState>
>(MessagesThunkEnum.SendRegistrationCompleted, async () => {
  // send the message
  await browser.runtime.sendMessage(new ProviderRegistrationCompletedMessage());
});

export default sendRegistrationCompletedThunk;
