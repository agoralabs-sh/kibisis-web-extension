import { IWalletAccount } from '@agoralabs-sh/algorand-provider';
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// Enums
import { MessagesThunkEnum } from '../../../enums';

// Events
import { ExtensionEnableResponseEvent } from '../../../events';

// Types
import { IAccount, ILogger, IMainRootState, ISession } from '../../../types';

interface IPayload {
  session: ISession;
  tabId: number;
}

const sendEnableResponse: AsyncThunk<
  void, // return
  IPayload, // args
  Record<string, never>
> = createAsyncThunk<void, IPayload, { state: IMainRootState }>(
  MessagesThunkEnum.SendEnableResponse,
  async ({ session, tabId }, { getState }) => {
    const accounts: IAccount[] = getState().accounts.items;
    const functionName: string = 'sendEnableResponse';
    const logger: ILogger = getState().application.logger;
    const message: ExtensionEnableResponseEvent =
      new ExtensionEnableResponseEvent(tabId, {
        accounts: session.authorizedAddresses.map<IWalletAccount>((address) => {
          const account: IAccount | null =
            accounts.find((value) => value.address === address) || null;

          return {
            address,
            ...(account?.name && {
              name: account.name,
            }),
          };
        }),
        genesisHash: '',
        genesisId: '',
        sessionId: session.id,
      });

    logger.debug(
      `${functionName}(): sending "${message.event}" message to content script`
    );

    // send the response to the content script
    await browser.tabs.sendMessage(tabId, message);
  }
);

export default sendEnableResponse;
