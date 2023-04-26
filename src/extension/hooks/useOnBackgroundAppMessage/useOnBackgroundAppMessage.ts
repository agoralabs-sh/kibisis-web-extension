import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import browser from 'webextension-polyfill';

// Enums
import { EventNameEnum } from '@common/enums';

// Events
import {
  ExtensionEnableRequestEvent,
  ExtensionSignBytesRequestEvent,
  ExtensionSignTxnsRequestEvent,
} from '@common/events';

// Features
import {
  setEnableRequest,
  setSignBytesRequest,
  setSignTxnsRequest,
} from '@extension/features/messages';

// Selectors
import { useSelectLogger } from '@extension/selectors';

// Types
import { IExtensionRequestEvents, ILogger } from '@common/types';
import { IAppThunkDispatch } from '@extension/types';

export default function useOnBackgroundAppMessage(
  filterEvents: EventNameEnum[],
  originTabId: number | null
): void {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const logger: ILogger = useSelectLogger();
  const handleOnExtensionMessage = (message: IExtensionRequestEvents) => {
    const { event, id } = message;

    logger.debug(
      `${useOnBackgroundAppMessage.name}#${handleOnExtensionMessage.name}(): extension message "${event}" received from the background`
    );

    if (!originTabId) {
      logger.debug(
        `${useOnBackgroundAppMessage.name}#${handleOnExtensionMessage.name}(): no origin tab id supplied for event "${id}" removing app`
      );

      return;
    }

    switch (event) {
      case EventNameEnum.ExtensionEnableRequest:
        if (
          filterEvents.find(
            (value) => value === EventNameEnum.ExtensionEnableRequest
          )
        ) {
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
              tabId: originTabId,
            })
          );
        }

        break;
      case EventNameEnum.ExtensionSignBytesRequest:
        if (
          filterEvents.find(
            (value) => value === EventNameEnum.ExtensionSignBytesRequest
          )
        ) {
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
              tabId: originTabId,
            })
          );
        }

        break;
      case EventNameEnum.ExtensionSignTxnsRequest:
        if (
          filterEvents.find(
            (value) => value === EventNameEnum.ExtensionSignTxnsRequest
          )
        ) {
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
              tabId: originTabId,
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
