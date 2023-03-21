import browser from 'webextension-polyfill';

// Services
import { ExternalEventService } from './services/extension';

// Types
import { ILogger } from './types';

// Utils
import { createLogger, injectScript } from './utils';

(() => {
  const logger: ILogger = createLogger(
    __ENV__ === 'development' ? 'debug' : 'error'
  );
  const externalEventService: ExternalEventService = new ExternalEventService({
    logger,
  });

  // inject the web resources to the web page to initialise the window.algorand object
  injectScript(browser.runtime.getURL('agora-wallet.js'));

  // handle incoming events from the web page
  window.addEventListener(
    'message',
    externalEventService.onExternalMessage.bind(externalEventService)
  );
})();
