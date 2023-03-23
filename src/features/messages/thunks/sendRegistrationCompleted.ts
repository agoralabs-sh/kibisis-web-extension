import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Enums
import { MessagesThunkEnum } from '../../../enums';

// Events
import { ExtensionRegistrationCompletedEvent } from '../../../events';

// Types
import { ILogger, IMainRootState } from '../../../types';
import browser from 'webextension-polyfill';

const sendRegistrationCompleted: AsyncThunk<
  void, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<void, undefined, { state: IMainRootState }>(
  MessagesThunkEnum.SendRegistrationCompleted,
  async (_, { getState }) => {
    const functionName: string = 'sendRegistrationCompleted';
    const logger: ILogger = getState().application.logger;
    const event: ExtensionRegistrationCompletedEvent =
      new ExtensionRegistrationCompletedEvent();

    logger.debug(`${functionName}(): sending "${event.event}" to the bridge`);

    // send the message
    await browser.runtime.sendMessage(event);
  }
);

export default sendRegistrationCompleted;
