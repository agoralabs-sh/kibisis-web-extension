import {
  ARC0027MethodEnum,
  IAccount as IAVMWebProvideAccount,
  IEnableResult,
} from '@agoralabs-sh/avm-web-provider';
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { MessagesThunkEnum } from '@extension/enums';

// features
import { removeEventByIdThunk } from '@extension/features/events';

// messages
import { ClientResponseMessage } from '@common/messages';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';
import type { IEnableResponseThunkPayload } from '../types';

const sendEnableResponseThunk: AsyncThunk<
  void, // return
  IEnableResponseThunkPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  void,
  IEnableResponseThunkPayload,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  MessagesThunkEnum.SendEnableResponse,
  async ({ error, event, session }, { dispatch, getState }) => {
    const accounts: IAccount[] = getState().accounts.items;
    const logger: ILogger = getState().system.logger;

    logger.debug(
      `${MessagesThunkEnum.SendEnableResponse}: sending "${ARC0027MethodEnum.Enable}" message to the content script`
    );

    // send the error the webpage (via the content script)
    if (error) {
      await browser.tabs.sendMessage(
        event.payload.originTabId,
        new ClientResponseMessage<IEnableResult>({
          error,
          method: event.payload.message.method,
          requestId: event.payload.message.id,
        })
      );

      // remove the event
      dispatch(removeEventByIdThunk(event.id));

      return;
    }

    // if there is a session, send it back to the webpage (via the content script)
    if (session) {
      await browser.tabs.sendMessage(
        event.payload.originTabId,
        new ClientResponseMessage<IEnableResult>({
          method: event.payload.message.method,
          requestId: event.payload.message.id,
          result: {
            accounts: session.authorizedAddresses.map<IAVMWebProvideAccount>(
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
          },
        })
      );
    }

    // remove the event
    dispatch(removeEventByIdThunk(event.id));
  }
);

export default sendEnableResponseThunk;
