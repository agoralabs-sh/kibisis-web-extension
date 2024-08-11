import {
  ARC0027MethodEnum,
  ISignTransactionsResult,
} from '@agoralabs-sh/avm-web-provider';
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import browser from 'webextension-polyfill';

// enums
import { MessagesThunkEnum } from '@extension/enums';

// features
import { removeEventByIdThunk } from '@extension/features/events';

// messages
import { ClientResponseMessage } from '@common/messages';

// types
import type {
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';
import type { ISignTransactionsResponseThunkPayload } from '../types';

const sendSignTransactionsResponseThunk: AsyncThunk<
  void, // return
  ISignTransactionsResponseThunkPayload, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  void,
  ISignTransactionsResponseThunkPayload,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(
  MessagesThunkEnum.SendSignTransactionsResponse,
  async ({ error, event, stxns }, { dispatch, getState }) => {
    const logger = getState().system.logger;

    logger.debug(
      `${MessagesThunkEnum.SendSignTransactionsResponse}: sending "${ARC0027MethodEnum.SignTransactions}" message to content script`
    );

    // send the error the webpage (via the content script)
    if (error) {
      await browser.tabs.sendMessage(
        event.payload.originTabId,
        new ClientResponseMessage<ISignTransactionsResult>({
          error,
          id: uuid(),
          method: event.payload.message.method,
          requestId: event.payload.message.id,
        })
      );

      // remove the event
      dispatch(removeEventByIdThunk(event.id));

      return;
    }

    // if there is signed transactions, send them back to the webpage (via the content script)
    if (stxns) {
      await browser.tabs.sendMessage(
        event.payload.originTabId,
        new ClientResponseMessage<ISignTransactionsResult>({
          id: uuid(),
          method: event.payload.message.method,
          requestId: event.payload.message.id,
          result: {
            providerId: __PROVIDER_ID__,
            stxns,
          },
        })
      );
    }

    // remove the event
    dispatch(removeEventByIdThunk(event.id));
  }
);

export default sendSignTransactionsResponseThunk;
