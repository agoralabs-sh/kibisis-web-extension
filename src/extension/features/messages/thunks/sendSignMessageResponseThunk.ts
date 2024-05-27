import {
  ARC0027MethodEnum,
  ISignMessageResult,
} from '@agoralabs-sh/avm-web-provider';
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import browser from 'webextension-polyfill';

// enums
import { MessagesThunkEnum } from '@extension/enums';

// messages
import { ClientResponseMessage } from '@common/messages';

// types
import type { IBaseAsyncThunkConfig } from '@extension/types';
import type { ISignMessageResponseThunkPayload } from '../types';

const sendSignMessageResponseThunk: AsyncThunk<
  void, // return
  ISignMessageResponseThunkPayload, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<
  void,
  ISignMessageResponseThunkPayload,
  IBaseAsyncThunkConfig
>(
  MessagesThunkEnum.SendSignMessageResponse,
  async ({ error, event, signature, signer }, { getState }) => {
    const logger = getState().system.logger;

    logger.debug(
      `${MessagesThunkEnum.SendSignMessageResponse}: sending "${ARC0027MethodEnum.SignMessage}" message to content script`
    );

    // send the error the webpage (via the content script)
    if (error) {
      await browser.tabs.sendMessage(
        event.payload.originTabId,
        new ClientResponseMessage<ISignMessageResult>({
          error,
          id: uuid(),
          method: event.payload.message.method,
          requestId: event.payload.message.id,
        })
      );

      return;
    }

    // if there is a signature, send it back to the webpage (via the content script)
    if (signature && signer) {
      await browser.tabs.sendMessage(
        event.payload.originTabId,
        new ClientResponseMessage<ISignMessageResult>({
          id: uuid(),
          method: event.payload.message.method,
          requestId: event.payload.message.id,
          result: {
            providerId: __PROVIDER_ID__,
            signature,
            signer,
          },
        })
      );
    }
  }
);

export default sendSignMessageResponseThunk;
