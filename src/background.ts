import browser from 'webextension-polyfill';

// Enums
import { EventNameEnum } from './enums';

// Events
import { RegistrationCompletedEvent } from './events';

// Services
import { BackgroundService } from './services';

// Types
import { ILogger } from './types';

// Utils
import { createLogger } from './utils';

type IEvents = RegistrationCompletedEvent;

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
    switch (message.event) {
      case EventNameEnum.RegistrationCompleted:
        await backgroundService.onRegistrationComplete();

        break;
      default:
        break;
    }
  });
  browser.windows.onRemoved.addListener(
    backgroundService.onWindowRemove.bind(backgroundService)
  );
})();
