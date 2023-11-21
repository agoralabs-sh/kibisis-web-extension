import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { EventNameEnum } from '@common/enums';
import { MessagesThunkEnum } from '@extension/enums';

// events
import { ExtensionSignBytesResponseEvent } from '@common/events';

// types
import { ILogger } from '@common/types';
import { IMainRootState } from '@extension/types';
import { IBaseResponseThunkPayload } from '../types';

interface IPayload extends IBaseResponseThunkPayload {
  encodedSignature: string | null;
}

const sendSignBytesResponse: AsyncThunk<
  void, // return
  IPayload, // args
  Record<string, never>
> = createAsyncThunk<void, IPayload, { state: IMainRootState }>(
  MessagesThunkEnum.SendSignBytesResponse,
  async ({ encodedSignature, error, requestEventId, tabId }, { getState }) => {
    const functionName: string = 'sendSignBytesResponse';
    const logger: ILogger = getState().system.logger;
    let message: ExtensionSignBytesResponseEvent;

    logger.debug(
      `${functionName}(): sending "${EventNameEnum.ExtensionSignBytesResponse}" message to content script`
    );

    // send the error response to the background script & the content script
    if (error) {
      message = new ExtensionSignBytesResponseEvent(
        requestEventId,
        null,
        error
      );

      await Promise.all([
        browser.runtime.sendMessage(message),
        browser.tabs.sendMessage(tabId, message),
      ]);

      return;
    }

    if (encodedSignature) {
      message = new ExtensionSignBytesResponseEvent(
        requestEventId,
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
