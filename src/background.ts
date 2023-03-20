import browser, { Runtime } from 'webextension-polyfill';

// Enums
import { EventNameEnum } from './enums';

// Events
import { EnableRequestEvent, RegistrationCompletedEvent } from './events';

// Services
import { BackgroundService } from './services/extension';

// Types
import { ILogger } from './types';

// Utils
import { createLogger } from './utils';

type IEvents = RegistrationCompletedEvent;
type IExternalEvents = EnableRequestEvent;

(() => {
  const logger: ILogger = createLogger(
    __ENV__ === 'development' ? 'debug' : 'error'
  );
  const backgroundService: BackgroundService = new BackgroundService({
    logger,
  });

  // register events
  browser.browserAction.onClicked.addListener(
    backgroundService.onExtensionClick.bind(backgroundService)
  );
  browser.runtime.onMessage.addListener(async (message: IEvents) => {
    logger.debug(
      `browser.runtime.onMessage.addListener(): "${message.event}" sent`
    );

    switch (message.event) {
      case EventNameEnum.RegistrationCompleted:
        await backgroundService.onRegistrationComplete();

        break;
      default:
        break;
    }
  });
  browser.runtime.onMessageExternal.addListener(
    async (
      message: IExternalEvents,
      sender: Runtime.MessageSender,
      sendResponse
    ) => {
      logger.debug(
        `browser.runtime.onMessageExternal.addListener(): "${message.event}" sent`
      );

      switch (message.event) {
        case EventNameEnum.EnableRequest:
          if (sender.url) {
            return await backgroundService.onEnableRequest(
              message,
              new URL(sender.url).host,
              sendResponse
            );
          }

          logger.debug(
            `browser.runtime.onMessageExternal.addListener(): ignoring "${message.event}" because no url was present in the sender`
          );

          break;
        default:
          break;
      }
    }
  );
  browser.windows.onRemoved.addListener(
    backgroundService.onWindowRemove.bind(backgroundService)
  );
})();
