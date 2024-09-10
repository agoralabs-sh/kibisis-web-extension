import AlgorandApp from '@ledgerhq/hw-app-algorand';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { listen } from '@ledgerhq/logs';

// constants
import { ADDRESS_BATCH_SIZE } from './constants';

// errors
import { LedgerFetchError, LedgerNotConnectedError } from '@extension/errors';

// types
import type { ILedgerAccount } from '@extension/types';
import type { IFetchPublicKeysOptions, IFetchPublicKeysResult } from './types';

export default class LedgerService {
  /**
   * public static functions
   */

  /**
   * Fetches a batch of public keys from the ledger starting at a supplied start index, or 0 if no index is supplied.
   * @param {IFetchPublicKeysOptions} options - the start index.
   * @returns {Promise<ILedgerAccount[]>} a promise that resolves to the fetched public keys.
   * @throws {LedgerNotConnectedError} If no device is connected.
   * @throws {LedgerFetchError} If there was an error fetching public keys.
   * @public
   * @static
   */
  public static async fetchPublicKeys({
    logger,
    start = 0,
  }: IFetchPublicKeysOptions): Promise<ILedgerAccount[]> {
    const _functionName = 'fetchPublicKeys';
    let app: AlgorandApp;
    let result: IFetchPublicKeysResult[];
    let transport: TransportWebHID;

    if (logger) {
      listen((log) =>
        logger.debug(`${LedgerService.name}#${_functionName}:`, log)
      );
    }

    try {
      transport = (await TransportWebHID.create()) as TransportWebHID;
    } catch (error) {
      logger?.error(`${LedgerService.name}#${_functionName}:`, error);

      throw new LedgerNotConnectedError(error.message);
    }

    logger?.debug(
      `${LedgerService.name}#${_functionName}: connected to ledger device "${transport.device}"`
    );

    app = new AlgorandApp(transport);

    try {
      result = await Promise.all(
        Array.from({ length: ADDRESS_BATCH_SIZE }, (_, index) =>
          app.getAddress(`44'/283'/${start + index}'/0/0`)
        )
      );
    } catch (error) {
      logger?.error(`${LedgerService.name}#${_functionName}:`, error);

      throw new LedgerFetchError(error.message);
    }

    return result.map(({ publicKey }, index) => ({
      index,
      publicKey,
    }));
  }

  /**
   * Convenience function that simply checks if the browser supports a connection to a Ledger device.
   * @returns {Promise<boolean>} true of the browser supports a connection to a Ledger device, false otherwise.
   * @public
   * @static
   */
  public static async isSupported(): Promise<boolean> {
    return await TransportWebHID.isSupported();
  }
}
