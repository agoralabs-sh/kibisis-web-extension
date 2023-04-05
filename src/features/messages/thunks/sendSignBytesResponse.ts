import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// Enums
import { EventNameEnum, MessagesThunkEnum } from '../../../enums';

// Errors
import { BaseSerializableError } from '../../../errors';

// Events
import { ExtensionSignBytesResponseEvent } from '../../../events';

// Types
import { ILogger, IMainRootState } from '../../../types';

interface IPayload {
  encodedSignature: string | null;
  error: BaseSerializableError | null;
  tabId: number;
}

const sendSignBytesResponse: AsyncThunk<
  void, // return
  IPayload, // args
  Record<string, never>
> = createAsyncThunk<void, IPayload, { state: IMainRootState }>(
  MessagesThunkEnum.SendSignBytesResponse,
  async ({ encodedSignature, error, tabId }, { getState }) => {
    const functionName: string = 'sendSignBytesResponse';
    const logger: ILogger = getState().application.logger;
    let message: ExtensionSignBytesResponseEvent;

    logger.debug(
      `${functionName}(): sending "${EventNameEnum.ExtensionSignBytesResponse}" message to content script`
    );

    // send the error response to the background script & the content script
    if (error) {
      message = new ExtensionSignBytesResponseEvent(null, error);

      await Promise.all([
        browser.runtime.sendMessage(message),
        browser.tabs.sendMessage(tabId, message),
      ]);

      return;
    }

    if (encodedSignature) {
      message = new ExtensionSignBytesResponseEvent(
        {
          encodedSignature,
        },
        null
      );

      await Promise.all([
        // send the response to the background
        browser.runtime.sendMessage(message),
        // send the response to the content script
        browser.tabs.sendMessage(tabId, message),
      ]);

      return;
    }
  }
);

export default sendSignBytesResponse;
