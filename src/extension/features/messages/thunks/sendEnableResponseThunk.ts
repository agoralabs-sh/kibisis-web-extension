import { IWalletAccount } from '@agoralabs-sh/algorand-provider';
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// Enums
import { EventNameEnum } from '@common/enums';
import { MessagesThunkEnum } from '@extension/enums';

// Events
import { ExtensionEnableResponseEvent } from '@common/events';

// Services
import { AccountService } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import { IAccount, IMainRootState, INetwork, ISession } from '@extension/types';
import { IBaseResponseThunkPayload } from '../types';

// Utils
import { mapAddressToWalletAccount } from '@extension/utils';

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
    const networks: INetwork[] = getState().networks.items;
    let message: ExtensionEnableResponseEvent;
    let network: INetwork | null;

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
      network =
        networks.find((value) => value.genesisHash === session?.genesisHash) ||
        null;
      message = new ExtensionEnableResponseEvent(
        requestEventId,
        {
          accounts: session.authorizedAddresses.map<IWalletAccount>((address) =>
            mapAddressToWalletAccount(address, {
              account:
                accounts.find(
                  (value) =>
                    AccountService.convertPublicKeyToAlgorandAddress(
                      value.publicKey
                    ) === address
                ) || null,
              network,
            })
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
