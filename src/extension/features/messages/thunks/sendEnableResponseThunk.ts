import { IWalletAccount } from '@agoralabs-sh/algorand-provider';
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { EventNameEnum } from '@common/enums';
import { MessagesThunkEnum } from '@extension/enums';

// events
import { ExtensionEnableResponseEvent } from '@common/events';

// services
import { AccountService } from '@extension/services';

// types
import { ILogger } from '@common/types';
import { IAccount, IMainRootState, INetwork, ISession } from '@extension/types';
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
  async ({ error, requestEventId, session, tabId }, { getState }) => {
    const accounts: IAccount[] = getState().accounts.items;
    const logger: ILogger = getState().system.logger;
    let message: ExtensionEnableResponseEvent;

    logger.debug(
      `${sendEnableResponseThunk.name}(): sending "${EventNameEnum.ExtensionEnableResponse}" message to content script`
    );

    // send the error response to the background script & the content script
    if (error) {
      message = new ExtensionEnableResponseEvent(requestEventId, null, error);

      await Promise.all([
        browser.runtime.sendMessage(message),
        browser.tabs.sendMessage(tabId, message),
      ]);

      return;
    }

    if (session) {
      message = new ExtensionEnableResponseEvent(
        requestEventId,
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

export default sendEnableResponseThunk;
