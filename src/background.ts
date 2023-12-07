import browser, { Action, BrowserAction } from 'webextension-polyfill';

// services
import {
  BackgroundEventListener,
  BackgroundMessageHandler,
} from '@extension/services';

// types
import { ILogger } from '@common/types';

// utils
import { createLogger } from '@common/utils';

(() => {
  const logger: ILogger = createLogger(
    __ENV__ === 'development' ? 'debug' : 'error'
  );
  const backgroundEventListener: BackgroundEventListener =
    new BackgroundEventListener({
      logger,
    });
  const browserAction: Action.Static | BrowserAction.Static =
    browser.action || browser.browserAction; // TODO: use browser.action for v3
  const backgroundMessageHandler: BackgroundMessageHandler =
    new BackgroundMessageHandler({
      logger,
    });

  // listen to incoming messages from the content scripts and apps (pop-ups)
  browser.runtime.onMessage.addListener(
    backgroundMessageHandler.onMessage.bind(backgroundMessageHandler)
  );

  // listen to special events
  browserAction.onClicked.addListener(
    backgroundEventListener.onExtensionClick.bind(backgroundEventListener)
  );
  browser.windows.onRemoved.addListener(
    backgroundEventListener.onWindowRemove.bind(backgroundEventListener)
  );
  browser.runtime.onSuspend.addListener(() => {
    console.log('suspended!!');
  });
})();
