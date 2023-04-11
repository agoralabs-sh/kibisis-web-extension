import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// Enums
import { MessagesThunkEnum } from '@extension/enums';

// Events
import { ExtensionRegistrationCompletedEvent } from '@common/events';

// Types
import { ILogger } from '@common/types';
import { IMainRootState } from '@extension/types';

const sendRegistrationCompletedThunk: AsyncThunk<
  void, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<void, undefined, { state: IMainRootState }>(
  MessagesThunkEnum.SendRegistrationCompleted,
  async (_, { getState }) => {
    const logger: ILogger = getState().application.logger;
    const event: ExtensionRegistrationCompletedEvent =
      new ExtensionRegistrationCompletedEvent();

    logger.debug(
      `${sendRegistrationCompletedThunk.name}: sending "${event.event}" to the bridge`
    );

    // send the message
    await browser.runtime.sendMessage(event);
  }
);

export default sendRegistrationCompletedThunk;
