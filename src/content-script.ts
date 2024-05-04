import { AVMWebProvider } from '@agoralabs-sh/avm-web-provider';
import browser from 'webextension-polyfill';

// services
import ClientMessageBroker from '@external/services/ClientMessageBroker';
import LegacyUseWalletMessageBroker from '@external/services/LegacyUseWalletMessageBroker';

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
  const logger: ILogger = createLogger(debug ? 'debug' : 'error');
  const clientMessageBroker: ClientMessageBroker = new ClientMessageBroker({
    logger,
  });

  // handle requests from the webpage
  avmWebProvider.onDisable(
    clientMessageBroker.onRequestMessage.bind(clientMessageBroker)
  );
  avmWebProvider.onDiscover(
    clientMessageBroker.onRequestMessage.bind(clientMessageBroker)
  );
  avmWebProvider.onEnable(
    clientMessageBroker.onRequestMessage.bind(clientMessageBroker)
  );
  avmWebProvider.onPostTransactions(
    clientMessageBroker.onRequestMessage.bind(clientMessageBroker)
  );
  avmWebProvider.onSignAndPostTransactions(
    clientMessageBroker.onRequestMessage.bind(clientMessageBroker)
  );
  avmWebProvider.onSignMessage(
    clientMessageBroker.onRequestMessage.bind(clientMessageBroker)
  );
  avmWebProvider.onSignTransactions(
    clientMessageBroker.onRequestMessage.bind(clientMessageBroker)
  );

  /**
   * deprecated - older versions of use-wallet will still use broadcastchannel messages
   */
  LegacyUseWalletMessageBroker.init({ logger });

  /**
   * deprecated - this is using algorand-provider, but will be phased out in favour of the new avm-web-provider
   */
  // inject the web resources into the web page to initialize the window.algorand object
  injectScript(browser.runtime.getURL('algorand-provider.js'));
})();
