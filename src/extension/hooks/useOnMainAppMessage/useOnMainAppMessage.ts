import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import browser, { Runtime } from 'webextension-polyfill';

// enums
import { EventNameEnum } from '@common/enums';

// events
import {
  ExtensionEnableRequestEvent,
  ExtensionSignBytesRequestEvent,
  ExtensionSignTxnsRequestEvent,
} from '@common/events';

// features
import {
  setEnableRequest,
  setSignBytesRequest,
  setSignTxnsRequest,
} from '@extension/features/messages';

// selectors
import { useSelectLogger } from '@extension/selectors';

// types
import { IExtensionRequestEvents, ILogger } from '@common/types';
import { IAppThunkDispatch } from '@extension/types';

export default function useOnMainAppMessage(): void {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const logger: ILogger = useSelectLogger();
  const handleOnExtensionMessage = (
    message: IExtensionRequestEvents,
    sender: Runtime.MessageSender
  ) => {
    logger.debug(
      `${useOnMainAppMessage.name}#${handleOnExtensionMessage.name}(): extension message "${message.event}" received from the content script`
    );

    switch (message.event) {
      case EventNameEnum.ExtensionEnableRequest:
        if (sender.tab?.id) {
          // show the enable modal
          dispatch(
            setEnableRequest({
              appName: (message as ExtensionEnableRequestEvent).payload.appName,
              authorizedAddresses: [], // no addresses have been selected
              description: (message as ExtensionEnableRequestEvent).payload
                .description,
              host: (message as ExtensionEnableRequestEvent).payload.host,
              iconUrl: (message as ExtensionEnableRequestEvent).payload.iconUrl,
              network: (message as ExtensionEnableRequestEvent).payload.network,
              requestEventId: message.id,
              tabId: sender.tab.id,
            })
          );
        }

        break;
      case EventNameEnum.ExtensionSignBytesRequest:
        if (sender.tab?.id) {
          // show the sign bytes modal
          dispatch(
            setSignBytesRequest({
              appName: (message as ExtensionSignBytesRequestEvent).payload
                .appName,
              authorizedAddresses: (message as ExtensionSignBytesRequestEvent)
                .payload.authorizedAddresses,
              encodedData: (message as ExtensionSignBytesRequestEvent).payload
                .encodedData,
              host: (message as ExtensionSignBytesRequestEvent).payload.host,
              iconUrl: (message as ExtensionSignBytesRequestEvent).payload
                .iconUrl,
              signer: (message as ExtensionSignBytesRequestEvent).payload
                .signer,
              requestEventId: message.id,
              tabId: sender.tab.id,
            })
          );
        }

        break;
      case EventNameEnum.ExtensionSignTxnsRequest:
        if (sender.tab?.id) {
          // show the sign txns modal
          dispatch(
            setSignTxnsRequest({
              appName: (message as ExtensionSignTxnsRequestEvent).payload
                .appName,
              authorizedAddresses: (message as ExtensionSignTxnsRequestEvent)
                .payload.authorizedAddresses,
              host: (message as ExtensionSignTxnsRequestEvent).payload.host,
              iconUrl: (message as ExtensionSignTxnsRequestEvent).payload
                .iconUrl,
              network: (message as ExtensionSignTxnsRequestEvent).payload
                .network,
              requestEventId: message.id,
              tabId: sender.tab.id,
              transactions: (message as ExtensionSignTxnsRequestEvent).payload
                .txns,
            })
          );
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
}
