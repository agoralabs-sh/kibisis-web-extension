// Services
import { BackgroundService } from './services';

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

  // register events
  browser.browserAction.onClicked.addListener(
    backgroundService.onExtensionClick.bind(backgroundService)
  );
  browser.windows.onRemoved.addListener(
    backgroundService.onWindowRemove.bind(backgroundService)
  );
})();
