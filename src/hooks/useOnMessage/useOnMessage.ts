import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import browser, { Runtime } from 'webextension-polyfill';

// Enums
import { EventNameEnum } from '../../enums';

// Events
import { ExtensionEnableRequestEvent } from '../../events';

// Features
import { sendEnableResponse } from '../../features/messages';
import {
  IConnectRequest,
  saveSession,
  setConnectRequest,
} from '../../features/sessions';

// Selectors
import { useSelectLogger, useSelectSessions } from '../../selectors';

// Types
import {
  IAppThunkDispatch,
  IExtensionEvents,
  ILogger,
  ISession,
} from '../../types';

export default function useOnMessage(): void {
  const dispatch = useDispatch<IAppThunkDispatch>();
  const logger: ILogger = useSelectLogger();
  const sessions: ISession[] = useSelectSessions();
  const [incomingConnectRequest, setIncomingConnectRequest] = useState<Omit<
    IConnectRequest,
    'authorizedAddresses'
  > | null>(null);
  const handleOnExtensionMessage = (
    message: IExtensionEvents,
    sender: Runtime.MessageSender
  ) => {
    logger.debug(
      `${useOnMessage.name}#handleOnExtensionMessage(): extension message "${message.event}" received from the content script`
    );

    switch (message.event) {
      case EventNameEnum.ExtensionEnableRequest:
        if (sender.tab?.id) {
          setIncomingConnectRequest({
            appName: (message as ExtensionEnableRequestEvent).payload.appName,
            genesisHash: (message as ExtensionEnableRequestEvent).payload
              .genesisHash,
            host: (message as ExtensionEnableRequestEvent).payload.host,
            iconUrl: (message as ExtensionEnableRequestEvent).payload.iconUrl,
            tabId: sender.tab.id,
          });
        }

        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // handle messages
    browser.runtime.onMessage.addListener(handleOnExtensionMessage);

    return function cleanup() {
      browser.runtime.onMessage.removeListener(handleOnExtensionMessage);
    };
  }, []);
  useEffect(() => {
    let session: ISession | null;

    if (incomingConnectRequest) {
      session =
        sessions.find((value) => value.host === incomingConnectRequest.host) ||
        null;

      // if we have a session, just return that
      if (session) {
        session = {
          ...session,
          usedAt: Math.round(new Date().getTime() / 1000),
        };

        dispatch(saveSession(session));
        dispatch(
          sendEnableResponse({
            session,
            tabId: incomingConnectRequest.tabId,
          })
        );
        setIncomingConnectRequest(null);

        return;
      }

      // otherwise, show the connect modal
      dispatch(
        setConnectRequest({
          ...incomingConnectRequest,
          authorizedAddresses: [],
        })
      );
      setIncomingConnectRequest(null);
    }
  }, [incomingConnectRequest]);
}
