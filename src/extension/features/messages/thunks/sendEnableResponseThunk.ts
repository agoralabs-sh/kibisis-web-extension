import { IWalletAccount } from '@agoralabs-sh/algorand-provider';
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { Arc0027MessageReferenceEnum } from '@common/enums';
import { MessagesThunkEnum } from '@extension/enums';

// features
import { removeEventByIdThunk } from '@extension/features/events';

// messages
import {
  Arc0027EnableRequestMessage,
  Arc0027EnableResponseMessage,
} from '@common/messages';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IBaseAsyncThunkConfig,
  IMainRootState,
  ISession,
} from '@extension/types';
import type { IBaseResponseThunkPayload } from '../types';

interface IPayload extends IBaseResponseThunkPayload {
  originMessage: Arc0027EnableRequestMessage;
  session: ISession | null;
}

const sendEnableResponseThunk: AsyncThunk<
  void, // return
  IPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<void, IPayload, IBaseAsyncThunkConfig<IMainRootState>>(
  MessagesThunkEnum.SendEnableResponse,
  async (
    { error, eventId, originMessage, originTabId, session },
    { dispatch, getState }
  ) => {
    const accounts: IAccount[] = getState().accounts.items;
    const logger: ILogger = getState().system.logger;

    logger.debug(
      `${MessagesThunkEnum.SendEnableResponse}: sending "${Arc0027MessageReferenceEnum.EnableResponse}" message to the content script`
    );

    // send the error the webpage (via the content script)
    if (error) {
      await browser.tabs.sendMessage(
        originTabId,
        new Arc0027EnableResponseMessage(originMessage.id, error, null)
      );

      // remove the event
      dispatch(removeEventByIdThunk(eventId));

      return;
    }

    // if there is a session, send it back to the webpage (via the content script)
    if (session) {
      await browser.tabs.sendMessage(
        originTabId,
        new Arc0027EnableResponseMessage(originMessage.id, null, {
          accounts: session.authorizedAddresses.map<IWalletAccount>(
            (address) => {
              const account: IAccount | null =
                accounts.find(
                  (value) =>
                    AccountService.convertPublicKeyToAlgorandAddress(
                      value.publicKey
                    ) === address
                ) || null;

              return {
                address,
                ...(account?.name && {
                  name: account.name,
                }),
              };
            }
          ),
          genesisHash: session.genesisHash,
          genesisId: session.genesisId,
          providerId: __PROVIDER_ID__,
          sessionId: session.id,
        })
      );
    }

    // remove the event
    dispatch(removeEventByIdThunk(eventId));
  }
);

export default sendEnableResponseThunk;
