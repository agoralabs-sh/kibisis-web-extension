import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import browser, { Runtime } from 'webextension-polyfill';

// Enums
import { EventNameEnum } from '../../enums';

// Events
import { ExtensionEnableRequestEvent } from '../../events';

// Selectors
import {
  useSelectLogger,
  useSelectNetworks,
  useSelectSelectedNetwork,
  useSelectSessions,
} from '../../selectors';

// Types
import {
  IAppThunkDispatch,
  IExtensionEvents,
  ILogger,
  INetwork,
  ISession,
} from '../../types';
import { IIncomingEnableRequest } from './types';

// Utils
import { handleEnableRequest } from './utils';

export default function useOnMessage(): void {
  const dispatch = useDispatch<IAppThunkDispatch>();
  const logger: ILogger = useSelectLogger();
  const networks: INetwork[] = useSelectNetworks();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const sessions: ISession[] = useSelectSessions();
  const [incomingEnableRequest, setIncomingEnableRequest] =
    useState<IIncomingEnableRequest | null>(null);
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
          setIncomingEnableRequest({
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
    if (incomingEnableRequest) {
      handleEnableRequest(dispatch, incomingEnableRequest, {
        networks,
        selectedNetwork,
        sessions,
      });
      setIncomingEnableRequest(null);
    }
  }, [incomingEnableRequest]);
}
