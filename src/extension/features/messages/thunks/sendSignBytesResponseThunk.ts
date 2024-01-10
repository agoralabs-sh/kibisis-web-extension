import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { Arc0013MessageReferenceEnum } from '@common/enums';
import { MessagesThunkEnum } from '@extension/enums';

// features
import { removeEventByIdThunk } from '@extension/features/events';

// messages
import {
  Arc0013SignBytesRequestMessage,
  Arc0013SignBytesResponseMessage,
} from '@common/messages';

// types
import { ILogger } from '@common/types';
import { IBaseAsyncThunkConfig } from '@extension/types';
import { IBaseResponseThunkPayload } from '../types';
import { SerializableArc0013UnauthorizedSignerError } from '@common/errors';

interface IPayload extends IBaseResponseThunkPayload {
  originMessage: Arc0013SignBytesRequestMessage;
  signature: string | null;
  signer: string | null;
}

const sendSignBytesResponseThunk: AsyncThunk<
  void, // return
  IPayload, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<void, IPayload, IBaseAsyncThunkConfig>(
  MessagesThunkEnum.SendSignBytesResponse,
  async (
    { error, eventId, originMessage, originTabId, signature, signer },
    { dispatch, getState }
  ) => {
    const logger: ILogger = getState().system.logger;

    logger.debug(
      `${MessagesThunkEnum.SendSignBytesResponse}: sending "${Arc0013MessageReferenceEnum.SignBytesResponse}" message to the content script`
    );

    // send the error the webpage (via the content script)
    if (error) {
      await browser.tabs.sendMessage(
        originTabId,
        new Arc0013SignBytesResponseMessage(originMessage.id, error, null)
      );

      // remove the event
      dispatch(removeEventByIdThunk(eventId));

      return;
    }

    if (!signature || !signer) {
      await browser.tabs.sendMessage(
        originTabId,
        new Arc0013SignBytesResponseMessage(
          originMessage.id,
          new SerializableArc0013UnauthorizedSignerError(
            signer,
            __PROVIDER_ID__
          ),
          null
        )
      );

      // remove the event
      dispatch(removeEventByIdThunk(eventId));

      return;
    }

    // if there is an encoded signature, send it back to the webpage (via the content script)
    await browser.tabs.sendMessage(
      originTabId,
      new Arc0013SignBytesResponseMessage(originMessage.id, null, {
        providerId: __PROVIDER_ID__,
        signature,
        signer,
      })
    );

    // remove the event
    dispatch(removeEventByIdThunk(eventId));
  }
);

export default sendSignBytesResponseThunk;
