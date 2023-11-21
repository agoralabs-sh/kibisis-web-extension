import browser, { Action, BrowserAction } from 'webextension-polyfill';

// services
import { BackgroundService } from '@extension/services';

// types
import { ILogger } from '@common/types';

// utils
import { createLogger } from '@common/utils';

(() => {
  const logger: ILogger = createLogger(
    __ENV__ === 'development' ? 'debug' : 'error'
  );
  const backgroundService: BackgroundService = new BackgroundService({
    logger,
  });
  const browserAction: Action.Static | BrowserAction.Static =
    browser.action || browser.browserAction; // TODO: use browser.action for v3

  // listen to extension messages
  browser.runtime.onMessage.addListener(
    backgroundService.onExtensionMessage.bind(backgroundService)
  );

  // listen to special events
  browserAction.onClicked.addListener(
    backgroundService.onExtensionClick.bind(backgroundService)
  );
  browser.windows.onRemoved.addListener(
    backgroundService.onWindowRemove.bind(backgroundService)
  );
})();
