import { decode as decodeHex } from '@stablelib/hex';
import AlgorandApp from '@ledgerhq/hw-app-algorand';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { listen } from '@ledgerhq/logs';

// constants
import { ADDRESS_BATCH_SIZE } from './constants';

// errors
import { LedgerFetchError, LedgerNotConnectedError } from '@extension/errors';

// types
import {
  IFetchAccountsOptions,
  IFetchAccountsResult,
  IGetAddressResult,
} from './types';

// utils
import createBIP0044PathFromNetwork from '@extension/utils/createBIP0044PathFromNetwork';

export default class LedgerManager {
  /**
   * public static functions
   */

  /**
   * Fetches a batch of accounts from the ledger starting at a supplied start account index, or 0 if no start account
   * index is supplied.
   * @param {IFetchAccountsOptions} options - The start index and teh network.
   * @returns {Promise<IFetchAccountsResult[]>} A promise that resolves to the fetched ledger accounts.
   * @throws {LedgerNotConnectedError} If no device is connected.
   * @throws {LedgerFetchError} If there was an error fetching accounts.
   * @public
   * @static
   */
  public static async fetchAccounts({
    logger,
    network,
    start = 0,
  }: IFetchAccountsOptions): Promise<IFetchAccountsResult[]> {
    const _functionName = 'fetchPublicKeys';
    let app: AlgorandApp;
    let result: IGetAddressResult[];
    let transport: TransportWebUSB;

    if (logger) {
      listen((log) =>
        logger.debug(`${LedgerManager.name}#${_functionName}:`, log)
      );
    }

    try {
      transport = (await TransportWebUSB.create()) as TransportWebUSB;
    } catch (error) {
      logger?.error(`${LedgerManager.name}#${_functionName}:`, error);

      throw new LedgerNotConnectedError(error.message);
    }

    logger?.debug(
      `${LedgerManager.name}#${_functionName}: connected to ledger device "${transport.device}"`
    );

    app = new AlgorandApp(transport);

    try {
      result = await Promise.all(
        Array.from({ length: ADDRESS_BATCH_SIZE }, (_, index) =>
          app.getAddress(
            createBIP0044PathFromNetwork({
              accountIndex: start + index,
              network,
            })
          )
        )
      );
    } catch (error) {
      logger?.error(`${LedgerManager.name}#${_functionName}:`, error);

      throw new LedgerFetchError(error.message);
    }

    return result.map(({ publicKey }, index) => ({
      accountIndex: start + index,
      publicKey: decodeHex(publicKey),
    }));
  }

  /**
   * Convenience function that simply checks if the browser supports a connection to a Ledger device.
   * @returns {Promise<boolean>} true of the browser supports a connection to a Ledger device, false otherwise.
   * @public
   * @static
   */
  public static async isSupported(): Promise<boolean> {
    return await TransportWebUSB.isSupported();
  }
}
