import browser, { Action, BrowserAction } from 'webextension-polyfill';

// services
import BackgroundEventListener from '@extension/services/BackgroundEventListener';
import BackgroundMessageHandler from '@extension/services/BackgroundMessageHandler';
import SettingsService from '@extension/services/SettingsService';

// types
import { ILogger } from '@common/types';
import { ISettings } from '@extension/types';

// utils
import createLogger from '@common/utils/createLogger';
import HeartbeatService from '@extension/services/HeartbeatService';

(async () => {
  const browserAction: Action.Static | BrowserAction.Static =
    browser.action || browser.browserAction; // TODO: use browser.action for v3
  let backgroundEventListener: BackgroundEventListener;
  let backgroundMessageHandler: BackgroundMessageHandler;
  let logger: ILogger = createLogger(
    __ENV__ === 'development' ? 'debug' : 'error'
  );
  let heartbeatService: HeartbeatService;
  let settingsService: SettingsService = new SettingsService({ logger });
  let settings: ISettings = await settingsService.getAll();

  // if the debug logging is enabled, re-create the logger with debug logging enabled
  if (settings.advanced.debugLogging) {
    logger = createLogger('debug');
  }

  heartbeatService = new HeartbeatService({ logger });

  backgroundEventListener = new BackgroundEventListener({
    logger,
  });
  backgroundMessageHandler = new BackgroundMessageHandler({
    logger,
  });

  // create an alarm to "tick" that will keep the extension from going idle
  await heartbeatService.createOrGetAlarm();

  // listen to incoming messages from the content scripts and apps (pop-ups)
  browser.runtime.onMessage.addListener(
    backgroundMessageHandler.onMessage.bind(backgroundMessageHandler)
  );

  // listen to special events
  browserAction.onClicked.addListener(
    backgroundEventListener.onExtensionClick.bind(backgroundEventListener)
  );
  browser.alarms.onAlarm.addListener(
    backgroundEventListener.onAlarm.bind(backgroundEventListener)
  );
  browser.windows.onFocusChanged.addListener(
    backgroundEventListener.onFocusChanged.bind(backgroundEventListener)
  );
  browser.windows.onRemoved.addListener(
    backgroundEventListener.onWindowRemove.bind(backgroundEventListener)
  );
})();
