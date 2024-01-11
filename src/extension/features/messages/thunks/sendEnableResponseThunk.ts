import { IWalletAccount } from '@agoralabs-sh/algorand-provider';
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { Arc0013MessageReferenceEnum } from '@common/enums';
import { MessagesThunkEnum } from '@extension/enums';

// features
import { removeEventByIdThunk } from '@extension/features/events';

// messages
import {
  Arc0013EnableRequestMessage,
  Arc0013EnableResponseMessage,
} from '@common/messages';

// services
import AccountService from '@extension/services/AccountService';

// types
import { ILogger } from '@common/types';
import { IAccount, IBaseAsyncThunkConfig, ISession } from '@extension/types';
import { IBaseResponseThunkPayload } from '../types';

interface IPayload extends IBaseResponseThunkPayload {
  originMessage: Arc0013EnableRequestMessage;
  session: ISession | null;
}

const sendEnableResponseThunk: AsyncThunk<
  void, // return
  IPayload, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<void, IPayload, IBaseAsyncThunkConfig>(
  MessagesThunkEnum.SendEnableResponse,
  async (
    { error, eventId, originMessage, originTabId, session },
    { dispatch, getState }
  ) => {
    const accounts: IAccount[] = getState().accounts.items;
    const logger: ILogger = getState().system.logger;

    logger.debug(
      `${MessagesThunkEnum.SendEnableResponse}: sending "${Arc0013MessageReferenceEnum.EnableResponse}" message to the content script`
    );

    // send the error the webpage (via the content script)
    if (error) {
      await browser.tabs.sendMessage(
        originTabId,
        new Arc0013EnableResponseMessage(originMessage.id, error, null)
      );

      // remove the event
      dispatch(removeEventByIdThunk(eventId));

      return;
    }

    // if there is a session, send it back to the webpage (via the content script)
    if (session) {
      await browser.tabs.sendMessage(
        originTabId,
        new Arc0013EnableResponseMessage(originMessage.id, null, {
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
