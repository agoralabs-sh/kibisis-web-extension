import { IWalletAccount } from '@agoralabs-sh/algorand-provider';
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// Enums
import { EventNameEnum } from '@common/enums';
import { MessagesThunkEnum } from '@extension/enums';

// Events
import { ExtensionEnableResponseEvent } from '@common/events';

// Types
import { ILogger } from '@common/types';
import { IAccount, IMainRootState, ISession } from '@extension/types';
import { IBaseResponseThunkPayload } from '../types';

interface IPayload extends IBaseResponseThunkPayload {
  session: ISession | null;
}

const sendEnableResponse: AsyncThunk<
  void, // return
  IPayload, // args
  Record<string, never>
> = createAsyncThunk<void, IPayload, { state: IMainRootState }>(
  MessagesThunkEnum.SendEnableResponse,
  async ({ error, requestEventId, session, tabId }, { getState }) => {
    const accounts: IAccount[] = getState().accounts.items;
    const functionName: string = 'sendEnableResponse';
    const logger: ILogger = getState().application.logger;
    let message: ExtensionEnableResponseEvent;

    logger.debug(
      `${functionName}(): sending "${EventNameEnum.ExtensionEnableResponse}" message to content script`
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
                accounts.find((value) => value.address === address) || null;

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

export default sendEnableResponse;
