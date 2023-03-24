import { BaseError, IWalletAccount } from '@agoralabs-sh/algorand-provider';
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// Enums
import { EventNameEnum, MessagesThunkEnum } from '../../../enums';

// Events
import { ExtensionEnableResponseEvent } from '../../../events';

// Types
import { IAccount, ILogger, IMainRootState, ISession } from '../../../types';

interface IPayload {
  error: BaseError | null;
  session: ISession | null;
  tabId: number;
}

const sendEnableResponse: AsyncThunk<
  void, // return
  IPayload, // args
  Record<string, never>
> = createAsyncThunk<void, IPayload, { state: IMainRootState }>(
  MessagesThunkEnum.SendEnableResponse,
  async ({ error, session, tabId }, { getState }) => {
    const accounts: IAccount[] = getState().accounts.items;
    const functionName: string = 'sendEnableResponse';
    const logger: ILogger = getState().application.logger;

    logger.debug(
      `${functionName}(): sending "${EventNameEnum.ExtensionEnableResponse}" message to content script`
    );

    // send the error response to the content script
    if (error) {
      return await browser.tabs.sendMessage(
        tabId,
        new ExtensionEnableResponseEvent(tabId, null, error)
      );
    }

    if (session) {
      // send the response to the content script
      return await browser.tabs.sendMessage(
        tabId,
        new ExtensionEnableResponseEvent(
          tabId,
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
            genesisHash: '',
            genesisId: '',
            sessionId: session.id,
          },
          null
        )
      );
    }
  }
);

export default sendEnableResponse;
