import browser from 'webextension-polyfill';

// Enums
import { EventNameEnum } from './enums';

// Events
import { EnableRequestEvent } from './events';

// Services
import { ContentEventService } from './services/page';

// Types
import { ILogger } from './types';

// Utils
import { createLogger, injectScript } from './utils';

type IRequestEvents = EnableRequestEvent;

(() => {
  const logger: ILogger = createLogger(
    __ENV__ === 'development' ? 'debug' : 'error'
  );
  const contentEventService: ContentEventService = new ContentEventService({
    logger,
  });

  // inject the web resources to the web page to initialise the window.algorand object
  injectScript(browser.runtime.getURL('agora-wallet.js'));

  // handle incoming events from the web page
  window.addEventListener(
    'message',
    async (event: MessageEvent<IRequestEvents>) => {
      if (event.source !== window || !event.data) {
        return;
      }

      switch (event.data.event) {
        case EventNameEnum.EnableRequest:
          return await contentEventService.onEnableRequest(event.data.payload);
        default:
          break;
      }
    }
  );
})();
