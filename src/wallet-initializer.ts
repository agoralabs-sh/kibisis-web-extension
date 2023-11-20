import { AlgorandProvider } from '@agoralabs-sh/algorand-provider';

// services
import { KibisisWalletManager } from '@external/services';

// types
import { ILogger } from '@common/types';
import { IWindow } from '@external/types';

// utils
import { createLogger } from '@common/utils';

(() => {
  const logger: ILogger = createLogger(
    __ENV__ === 'development' ? 'debug' : 'error'
  );
  const script: string = 'kibisis';
  let walletManager: KibisisWalletManager;

  // check for the algorand provider, if it doesn't exist, overwrite it
  if (
    !(window as IWindow).algorand ||
    !(window as IWindow).algorand?.addWallet
  ) {
    logger.debug(`${script}: no algorand provider found, creating a new one`);

    (window as IWindow).algorand = new AlgorandProvider();
  }

  walletManager = new KibisisWalletManager({
    logger,
  });

  // add the wallet manager
  (window as IWindow).algorand?.addWallet(walletManager, {
    replace: true,
  });
})();
