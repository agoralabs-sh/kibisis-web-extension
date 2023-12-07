import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { MessageTypeEnum } from '@common/enums';
import { MessagesThunkEnum } from '@extension/enums';

// features
import { removeEventByIdThunk } from '@extension/features/events';

// messages
import { SignTxnsResponseMessage } from '@common/messages';

// types
import { ILogger } from '@common/types';
import { IMainRootState } from '@extension/types';
import { IBaseResponseThunkPayload } from '../types';

interface IPayload extends IBaseResponseThunkPayload {
  signedTransactions: (string | null)[] | null;
}

const sendTxnsBytesResponseThunk: AsyncThunk<
  void, // return
  IPayload, // args
  Record<string, never>
> = createAsyncThunk<void, IPayload, { state: IMainRootState }>(
  MessagesThunkEnum.SendSignTxnsResponse,
  async (
    { error, eventId, signedTransactions: stxns, tabId },
    { dispatch, getState }
  ) => {
    const logger: ILogger = getState().system.logger;
    let message: SignTxnsResponseMessage;

    logger.debug(
      `${MessagesThunkEnum.SendSignTxnsResponse}: sending "${MessageTypeEnum.SignTxnsResponse}" message to content script`
    );

    // send the error the webpage (via the content script)
    if (error) {
      await browser.tabs.sendMessage(
        tabId,
        new SignTxnsResponseMessage(null, error)
      );

      // remove the event
      dispatch(removeEventByIdThunk(eventId));

      return;
    }

    // if there is signed transactions, send them back to the webpage (via the content script)
    if (stxns) {
      await browser.tabs.sendMessage(
        tabId,
        new SignTxnsResponseMessage(
          {
            stxns,
          },
          null
        )
      );
    }

    // remove the event
    dispatch(removeEventByIdThunk(eventId));
  }
);

export default sendTxnsBytesResponseThunk;
