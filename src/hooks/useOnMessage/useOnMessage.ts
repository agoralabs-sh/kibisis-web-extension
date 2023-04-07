import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import browser, { Runtime } from 'webextension-polyfill';

// Enums
import { EventNameEnum } from '../../enums';

// Events
import {
  ExtensionEnableRequestEvent,
  ExtensionSignBytesRequestEvent,
} from '../../events';

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
  IExtensionEnableRequestPayload,
  IExtensionEvents,
  IExtensionSignBytesRequestPayload,
  ILogger,
  INetwork,
  ISession,
} from '../../types';
import { IIncomingRequest } from './types';

// Utils
import { handleEnableRequest, handleSignBytesRequest } from './utils';

export default function useOnMessage(): void {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const logger: ILogger = useSelectLogger();
  const networks: INetwork[] = useSelectNetworks();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const sessions: ISession[] = useSelectSessions();
  const [incomingEnableRequest, setIncomingEnableRequest] =
    useState<IIncomingRequest<IExtensionEnableRequestPayload> | null>(null);
  const [incomingSignBytesRequest, setIncomingSignBytesRequest] =
    useState<IIncomingRequest<IExtensionSignBytesRequestPayload> | null>(null);
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
            description: (message as ExtensionEnableRequestEvent).payload
              .description,
            genesisHash: (message as ExtensionEnableRequestEvent).payload
              .genesisHash,
            host: (message as ExtensionEnableRequestEvent).payload.host,
            iconUrl: (message as ExtensionEnableRequestEvent).payload.iconUrl,
            tabId: sender.tab.id,
          });
        }

        break;
      case EventNameEnum.ExtensionSignBytesRequest:
        if (sender.tab?.id) {
          setIncomingSignBytesRequest({
            appName: (message as ExtensionEnableRequestEvent).payload.appName,
            encodedData: (message as ExtensionSignBytesRequestEvent).payload
              .encodedData,
            host: (message as ExtensionSignBytesRequestEvent).payload.host,
            iconUrl: (message as ExtensionEnableRequestEvent).payload.iconUrl,
            signer: (message as ExtensionSignBytesRequestEvent).payload.signer,
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
  useEffect(() => {
    if (incomingSignBytesRequest) {
      handleSignBytesRequest(dispatch, incomingSignBytesRequest, {
        sessions,
      });
      setIncomingSignBytesRequest(null);
    }
  }, [incomingSignBytesRequest]);
}
