import { IWalletAccount } from '@agoralabs-sh/algorand-provider';
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { MessageTypeEnum } from '@common/enums';
import { MessagesThunkEnum } from '@extension/enums';

// features
import { removeEventByIdThunk } from '@extension/features/events';

// messages
import { EnableResponseMessage } from '@common/messages';

// services
import { AccountService } from '@extension/services';

// types
import { ILogger } from '@common/types';
import { IAccount, IMainRootState, ISession } from '@extension/types';
import { IBaseResponseThunkPayload } from '../types';

interface IPayload extends IBaseResponseThunkPayload {
  session: ISession | null;
}

const sendEnableResponseThunk: AsyncThunk<
  void, // return
  IPayload, // args
  Record<string, never>
> = createAsyncThunk<void, IPayload, { state: IMainRootState }>(
  MessagesThunkEnum.SendEnableResponse,
  async ({ error, eventId, session, tabId }, { dispatch, getState }) => {
    const accounts: IAccount[] = getState().accounts.items;
    const logger: ILogger = getState().system.logger;

    logger.debug(
      `${MessagesThunkEnum.SendEnableResponse}: sending "${MessageTypeEnum.EnableResponse}" message to the content script`
    );

    // send the error the webpage (via the content script)
    if (error) {
      await browser.tabs.sendMessage(
        tabId,
        new EnableResponseMessage(null, error)
      );

      // remove the event
      dispatch(removeEventByIdThunk(eventId));

      return;
    }

    // if there is a session, send it back to the webpage (via the content script)
    if (session) {
      return await browser.tabs.sendMessage(
        tabId,
        new EnableResponseMessage(
          {
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
            sessionId: session.id,
          },
          null
        )
      );
    }

    // remove the event
    dispatch(removeEventByIdThunk(eventId));
  }
);

export default sendEnableResponseThunk;
