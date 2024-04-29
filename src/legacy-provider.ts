import { AlgorandProvider } from '@agoralabs-sh/algorand-provider';

// services
import LegacyProvider from '@external/services/LegacyProvider';

// types
import type { ILogger } from '@common/types';
import type { IWindow } from '@external/types';

// utils
import createLogger from '@common/utils/createLogger';

(() => {
  const logger: ILogger = createLogger(
    __ENV__ === 'development' ? 'debug' : 'error'
  );
  const script: string = 'kibisis';
  let legacyProvider: LegacyProvider;

  // check for the algorand provider, if it doesn't exist, overwrite it
  if (
    !(window as IWindow).algorand ||
    !(window as IWindow).algorand?.addWallet
  ) {
    logger.debug(`${script}: no algorand provider found, creating a new one`);

    (window as IWindow).algorand = new AlgorandProvider();
  }

  legacyProvider = new LegacyProvider();

  // add the wallet manager
  (window as IWindow).algorand?.addWallet(legacyProvider, {
    replace: true,
  });
})();
