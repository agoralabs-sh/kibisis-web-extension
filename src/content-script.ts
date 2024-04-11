import {
  ARC0027MethodEnum,
  AVMWebProvider,
} from '@agoralabs-sh/avm-web-provider';
import browser from 'webextension-polyfill';

// constants
import { ARC_0027_CHANNEL_NAME } from '@common/constants';

// services
import ExternalMessageBroker from '@external/services/ExternalMessageBroker';

// types
import type { ILogger } from '@common/types';

// utils
import createLogger from '@common/utils/createLogger';
import injectScript from '@external/utils/injectScript';

(() => {
  const debug: boolean = __ENV__ === 'development';
  const avmWebProvider: AVMWebProvider = AVMWebProvider.init(__PROVIDER_ID__, {
    debug,
  });
  const channel: BroadcastChannel = new BroadcastChannel(ARC_0027_CHANNEL_NAME);
  const logger: ILogger = createLogger(debug ? 'debug' : 'error');
  const externalMessageBroker: ExternalMessageBroker =
    new ExternalMessageBroker({
      channel,
      logger,
    });

  // handle requests from the webpage
  avmWebProvider.onDisable(
    externalMessageBroker.onRequestMessage.bind(externalMessageBroker)
  );
  avmWebProvider.onDiscover(
    externalMessageBroker.onRequestMessage.bind(externalMessageBroker)
  );
  avmWebProvider.onEnable(
    externalMessageBroker.onRequestMessage.bind(externalMessageBroker)
  );
  avmWebProvider.onPostTransactions(
    externalMessageBroker.onRequestMessage.bind(externalMessageBroker)
  );
  avmWebProvider.onSignAndPostTransactions(
    externalMessageBroker.onRequestMessage.bind(externalMessageBroker)
  );
  avmWebProvider.onSignTransactions(
    externalMessageBroker.onRequestMessage.bind(externalMessageBroker)
  );

  channel.onmessage = externalMessageBroker.onARC0027RequestMessage.bind(
    externalMessageBroker
  );

  // listen to incoming extension messages (from the background script / popup)
  browser.runtime.onMessage.addListener(
    externalMessageBroker.onARC0027ResponseMessage.bind(externalMessageBroker)
  );

  /**
   * deprecated - this is using algorand-provider, but will be phased out in favour of the broadcastchannel api
   */

  // inject the web resources into the web page to initialize the window.algorand object
  injectScript(browser.runtime.getURL('legacy-provider.js'));
})();
