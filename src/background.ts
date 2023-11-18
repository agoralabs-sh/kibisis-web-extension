import browser from 'webextension-polyfill';

// Services
import { BackgroundService } from '@extension/services';

// Types
import { ILogger } from '@common/types';

// Utils
import { createLogger } from '@common/utils';

(() => {
  const logger: ILogger = createLogger(
    __ENV__ === 'development' ? 'debug' : 'error'
  );
  const backgroundService: BackgroundService = new BackgroundService({
    logger,
  });

  // listen to extension messages
  browser.runtime.onMessage.addListener(
    backgroundService.onExtensionMessage.bind(backgroundService)
  );

  // listen to special events
  browser.action.onClicked.addListener(
    backgroundService.onExtensionClick.bind(backgroundService)
  );
  browser.windows.onRemoved.addListener(
    backgroundService.onWindowRemove.bind(backgroundService)
  );
})();
