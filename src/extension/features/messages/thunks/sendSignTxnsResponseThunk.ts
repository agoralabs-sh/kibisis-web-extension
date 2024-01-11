import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { Arc0013MessageReferenceEnum } from '@common/enums';
import { MessagesThunkEnum } from '@extension/enums';

// features
import { removeEventByIdThunk } from '@extension/features/events';

// messages
import {
  Arc0013SignTxnsRequestMessage,
  Arc0013SignTxnsResponseMessage,
} from '@common/messages';

// types
import { ILogger } from '@common/types';
import { IBaseAsyncThunkConfig } from '@extension/types';
import { IBaseResponseThunkPayload } from '../types';

interface IPayload extends IBaseResponseThunkPayload {
  originMessage: Arc0013SignTxnsRequestMessage;
  stxns: (string | null)[] | null;
}

const sendTxnsBytesResponseThunk: AsyncThunk<
  void, // return
  IPayload, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<void, IPayload, IBaseAsyncThunkConfig>(
  MessagesThunkEnum.SendSignTxnsResponse,
  async (
    { error, eventId, originMessage, originTabId, stxns },
    { dispatch, getState }
  ) => {
    const logger: ILogger = getState().system.logger;

    logger.debug(
      `${MessagesThunkEnum.SendSignTxnsResponse}: sending "${Arc0013MessageReferenceEnum.SignTxnsResponse}" message to content script`
    );

    // send the error the webpage (via the content script)
    if (error) {
      await browser.tabs.sendMessage(
        originTabId,
        new Arc0013SignTxnsResponseMessage(originMessage.id, error, null)
      );

      // remove the event
      dispatch(removeEventByIdThunk(eventId));

      return;
    }

    // if there is signed transactions, send them back to the webpage (via the content script)
    if (stxns) {
      await browser.tabs.sendMessage(
        originTabId,
        new Arc0013SignTxnsResponseMessage(originMessage.id, null, {
          providerId: __PROVIDER_ID__,
          stxns,
        })
      );
    }

    // remove the event
    dispatch(removeEventByIdThunk(eventId));
  }
);

export default sendTxnsBytesResponseThunk;
