import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Enums
import { MessagesThunkEnum } from '../../../enums';

// Events
import { ExtensionResetEvent } from '../../../events';

// Types
import { ILogger, IMainRootState } from '../../../types';
import browser from 'webextension-polyfill';

const sendResetThunk: AsyncThunk<
  void, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<void, undefined, { state: IMainRootState }>(
  MessagesThunkEnum.SendReset,
  async (_, { getState }) => {
    const logger: ILogger = getState().application.logger;
    const event: ExtensionResetEvent = new ExtensionResetEvent();

    logger.debug(
      `${sendResetThunk.name}: sending "${event.event}" to the bridge`
    );

    // send the message
    await browser.runtime.sendMessage(event);
  }
);

export default sendResetThunk;
