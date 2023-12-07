import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { MessageTypeEnum } from '@common/enums';
import { MessagesThunkEnum } from '@extension/enums';

// features
import { removeEventByIdThunk } from '@extension/features/events';

// messages
import { SignBytesResponseMessage } from '@common/messages';

// types
import { ILogger } from '@common/types';
import { IMainRootState } from '@extension/types';
import { IBaseResponseThunkPayload } from '../types';

interface IPayload extends IBaseResponseThunkPayload {
  encodedSignature: string | null;
}

const sendSignBytesResponseThunk: AsyncThunk<
  void, // return
  IPayload, // args
  Record<string, never>
> = createAsyncThunk<void, IPayload, { state: IMainRootState }>(
  MessagesThunkEnum.SendSignBytesResponse,
  async (
    { encodedSignature, error, eventId, tabId },
    { dispatch, getState }
  ) => {
    const logger: ILogger = getState().system.logger;

    logger.debug(
      `${MessagesThunkEnum.SendSignBytesResponse}: sending "${MessageTypeEnum.SignBytesResponse}" message to the content script`
    );

    // send the error the webpage (via the content script)
    if (error) {
      await browser.tabs.sendMessage(
        tabId,
        new SignBytesResponseMessage(null, error)
      );

      // remove the event
      dispatch(removeEventByIdThunk(eventId));

      return;
    }

    // if there is an encoded signature, send it back to the webpage (via the content script)
    if (encodedSignature) {
      await browser.tabs.sendMessage(
        tabId,
        new SignBytesResponseMessage(
          {
            encodedSignature,
          },
          null
        )
      );
    }

    // remove the event
    dispatch(removeEventByIdThunk(eventId));
  }
);

export default sendSignBytesResponseThunk;
