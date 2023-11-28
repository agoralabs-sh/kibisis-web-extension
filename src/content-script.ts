import browser from 'webextension-polyfill';

// services
import { ExternalEventService } from '@extension/services';

// types
import { ILogger } from '@common/types';

// utils
import { createLogger } from '@common/utils';
import { injectScript } from '@extension/utils';

(() => {
  const logger: ILogger = createLogger(
    __ENV__ === 'development' ? 'debug' : 'error'
  );
  const externalEventService: ExternalEventService = new ExternalEventService({
    logger,
  });

  // inject the web resources in to the web page to initialize the window.algorand object
  injectScript(browser.runtime.getURL('wallet-initializer.js'));

  // listen to incoming external messages (from the web page)
  window.addEventListener(
    'message',
    externalEventService.onExternalMessage.bind(externalEventService)
  );

  // listen to incoming extension messages (from the background script / popup)
  browser.runtime.onMessage.addListener(
    externalEventService.onExtensionMessage.bind(externalEventService)
  );
})();
