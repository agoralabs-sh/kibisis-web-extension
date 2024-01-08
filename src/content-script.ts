import browser from 'webextension-polyfill';

// constants
import { ARC_0013_CHANNEL_NAME } from '@external/constants';

// services
import ExternalMessageBroker from '@external/services/ExternalMessageBroker';

// types
import { ILogger } from '@common/types';

// utils
import createLogger from '@common/utils/createLogger';
import injectScript from '@external/utils/injectScript';

(() => {
  const channel: BroadcastChannel = new BroadcastChannel(ARC_0013_CHANNEL_NAME);
  const logger: ILogger = createLogger(
    __ENV__ === 'development' ? 'debug' : 'error'
  );
  const externalMessageBroker: ExternalMessageBroker =
    new ExternalMessageBroker({
      channel,
      logger,
    });

  // listen to broadcast messages from the webpage
  channel.onmessage = externalMessageBroker.onLegacyRequestMessage;

  // listen to incoming extension messages (from the background script / popup)
  browser.runtime.onMessage.addListener(
    externalMessageBroker.onResponseMessage.bind(externalMessageBroker)
  );

  /**
   * deprecated - this is using algorand-provider, but will be phased out in favour of the broadcastchannel api
   */

  // inject the web resources into the web page to initialize the window.algorand object
  injectScript(browser.runtime.getURL('legacy-provider.js'));

  // listen to incoming webpage messages (messages coming from the injected legacy-provider.js script in the webpage)
  window.addEventListener(
    'message',
    externalMessageBroker.onLegacyRequestMessage.bind(externalMessageBroker)
  );
})();
