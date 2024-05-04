import { AlgorandProvider } from '@agoralabs-sh/algorand-provider';

// services
import LegacyAlgorandProvider from '@external/services/LegacyAlgorandProvider';

// types
import type { IWindow } from '@external/types';

// utils
import createLogger from '@common/utils/createLogger';

(() => {
  const logger = createLogger(__ENV__ === 'development' ? 'debug' : 'error');
  const script = 'kibisis';
  let algorandProvider: LegacyAlgorandProvider;

  // check for the algorand provider, if it doesn't exist, overwrite it
  if (
    !(window as IWindow).algorand ||
    !(window as IWindow).algorand?.addWallet
  ) {
    logger.debug(`${script}: no algorand provider found, creating a new one`);

    (window as IWindow).algorand = new AlgorandProvider();
  }

  algorandProvider = new LegacyAlgorandProvider();

  // add the wallet manager
  (window as IWindow).algorand?.addWallet(algorandProvider, {
    replace: true,
  });
})();
