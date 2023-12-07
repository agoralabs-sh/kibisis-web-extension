import browser from 'webextension-polyfill';

// services
import { ExternalMessageBroker } from '@external/services';

// types
import { ILogger } from '@common/types';

// utils
import { createLogger } from '@common/utils';
import { injectScript } from '@extension/utils';

(() => {
  const logger: ILogger = createLogger(
    __ENV__ === 'development' ? 'debug' : 'error'
  );
  const externalMessageBroker: ExternalMessageBroker =
    new ExternalMessageBroker({
      logger,
    });

  // inject the web resources into the web page to initialize the window.algorand object
  injectScript(browser.runtime.getURL('wallet-initializer.js'));

  // listen to incoming webpage messages (messages coming from the injected wallet-initializer.js script in the webpage)
  window.addEventListener(
    'message',
    externalMessageBroker.onRequestMessage.bind(externalMessageBroker)
  );

  // listen to incoming extension messages (from the background script / popup)
  browser.runtime.onMessage.addListener(
    externalMessageBroker.onResponseMessage.bind(externalMessageBroker)
  );
})();
