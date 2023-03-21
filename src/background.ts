import browser from 'webextension-polyfill';

// Services
import { BridgeEventService, BackgroundService } from './services/extension';

// Types
import { ILogger } from './types';

// Utils
import { createLogger } from './utils';

(() => {
  const logger: ILogger = createLogger(
    __ENV__ === 'development' ? 'debug' : 'error'
  );
  const backgroundService: BackgroundService = new BackgroundService({
    logger,
  });
  const bridgeEventService: BridgeEventService = new BridgeEventService({
    logger,
  });

  // register events
  browser.runtime.onConnect.addListener(
    bridgeEventService.onConnected.bind(bridgeEventService)
  );
  browser.browserAction.onClicked.addListener(
    backgroundService.onExtensionClick.bind(backgroundService)
  );
  browser.runtime.onMessage.addListener(
    backgroundService.onInternalMessage.bind(backgroundService)
  );
  browser.windows.onRemoved.addListener(
    backgroundService.onWindowRemove.bind(backgroundService)
  );
})();
