import browser from 'webextension-polyfill';

// services
import ClientMessageHandler from '@extension/services/ClientMessageHandler';
import HeartbeatService from '@extension/services/HeartbeatService';
import ProviderActionListener from '@extension/services/ProviderActionListener';
import ProviderMessageHandler from '@extension/services/ProviderMessageHandler';
import SettingsService from '@extension/services/SettingsService';

// utils
import createLogger from '@common/utils/createLogger';

(async () => {
  const browserAction = browser.action || browser.browserAction; // TODO: use browser.action for v3
  let clientMessageHandler: ClientMessageHandler;
  let logger = createLogger(__ENV__ === 'development' ? 'debug' : 'error');
  let heartbeatService: HeartbeatService;
  let providerActionListener: ProviderActionListener;
  let providerMessageHandler: ProviderMessageHandler;
  let settingsService: SettingsService = new SettingsService({ logger });
  let settings = await settingsService.fetchFromStorage();

  // if the debug logging is enabled, re-create the logger with debug logging enabled
  if (settings.advanced.debugLogging) {
    logger = createLogger('debug');
  }

  heartbeatService = new HeartbeatService({ logger });
  clientMessageHandler = new ClientMessageHandler({
    logger,
  });
  providerActionListener = new ProviderActionListener({
    logger,
  });
  providerMessageHandler = new ProviderMessageHandler({
    logger,
  });

  // create an alarm to "tick" that will keep the extension from going idle
  await heartbeatService.createOrGetAlarm();

  // listen to incoming messages from clients (content scripts)
  browser.runtime.onMessage.addListener(
    clientMessageHandler.onMessage.bind(clientMessageHandler)
  );
  // listen to incoming messages from the provider (popups)
  browser.runtime.onMessage.addListener(
    providerMessageHandler.onMessage.bind(providerMessageHandler)
  );

  // listen to special extension events
  browser.alarms.onAlarm.addListener(
    providerActionListener.onAlarm.bind(providerActionListener)
  );
  browserAction.onClicked.addListener(
    providerActionListener.onExtensionClick.bind(providerActionListener)
  );
  browser.omnibox.onInputEntered.addListener(
    providerActionListener.onOmniboxInputEntered.bind(providerActionListener)
  );
  browser.runtime.onInstalled.addListener(
    providerActionListener.onInstalled.bind(providerActionListener)
  );
  browser.windows.onFocusChanged.addListener(
    providerActionListener.onFocusChanged.bind(providerActionListener)
  );
  browser.windows.onRemoved.addListener(
    providerActionListener.onWindowRemove.bind(providerActionListener)
  );
})();
