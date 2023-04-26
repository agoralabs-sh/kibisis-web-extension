import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// Enums
import { MessagesThunkEnum } from '@extension/enums';

// Events
import { ExtensionBackgroundAppLoadEvent } from '@common/events';

// Types
import { ILogger } from '@common/types';
import { IMainRootState } from '@extension/types';

const sendBackgroundAppLoadThunk: AsyncThunk<
  void, // return
  string, // args
  Record<string, never>
> = createAsyncThunk<void, string, { state: IMainRootState }>(
  MessagesThunkEnum.SendBackgroundAppLoad,
  async (eventId, { getState }) => {
    const logger: ILogger = getState().application.logger;
    const event: ExtensionBackgroundAppLoadEvent =
      new ExtensionBackgroundAppLoadEvent({
        eventId,
      });

    logger.debug(
      `${sendBackgroundAppLoadThunk.name}: sending "${event.event}" to the background for event "${eventId}"`
    );

    // send the message
    await browser.runtime.sendMessage(event);
  }
);

export default sendBackgroundAppLoadThunk;
