import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { EventNameEnum } from '@common/enums';
import { MessagesThunkEnum } from '@extension/enums';

// events
import { ExtensionSignTxnsResponseEvent } from '@common/events';

// types
import { ILogger } from '@common/types';
import { IMainRootState } from '@extension/types';
import { IBaseResponseThunkPayload } from '../types';

interface IPayload extends IBaseResponseThunkPayload {
  signedTransactions: (string | null)[] | null;
}

const sendTxnsBytesResponse: AsyncThunk<
  void, // return
  IPayload, // args
  Record<string, never>
> = createAsyncThunk<void, IPayload, { state: IMainRootState }>(
  MessagesThunkEnum.SendSignTxnsResponse,
  async (
    { error, requestEventId, signedTransactions: stxns, tabId },
    { getState }
  ) => {
    const logger: ILogger = getState().system.logger;
    let message: ExtensionSignTxnsResponseEvent;

    logger.debug(
      `${sendTxnsBytesResponse.name}(): sending "${EventNameEnum.ExtensionSignTxnsResponse}" message to content script`
    );

    // send the error response to the background script & the content script
    if (error) {
      message = new ExtensionSignTxnsResponseEvent(requestEventId, null, error);

      await Promise.all([
        browser.runtime.sendMessage(message),
        browser.tabs.sendMessage(tabId, message),
      ]);

      return;
    }

    if (stxns) {
      message = new ExtensionSignTxnsResponseEvent(
        requestEventId,
        {
          stxns,
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

export default sendTxnsBytesResponse;
