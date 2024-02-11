import { encode as encodeBase64 } from '@stablelib/base64';

// types
import type { IOptions } from './types';

/**
 * Convenience function that extracts the genesis has for atomic transaction group.
 * @param {IOptions} options - the encoded transactions.
 * @returns {string | null} the atomic transaction group genesis hash, or null if the atomic group is malformed.
 */
export default function extractGenesisHashFromAtomicTransactions({
  logger,
  transactions,
}: IOptions): string | null {
  const _functionName: string = 'extractGenesisHashFromAtomicTransactions';
  let genesisHashes: string[];

  try {
    genesisHashes = transactions.reduce<string[]>((acc, transaction) => {
      const genesisHash: string = encodeBase64(transaction.genesisHash);

      return acc.some((value) => value === genesisHash)
        ? acc
        : [...acc, genesisHash];
    }, []);

    // if there are too many genesis hashes or no genesis hashes, this is an invalid atomic transaction group
    if (genesisHashes.length > 1 || genesisHashes.length <= 0) {
      logger?.error(
        `the transaction group is not atomic, they are bound for multiple networks: [${genesisHashes.join(
          ','
        )}]`
      );

      return null;
    }

    return genesisHashes[0];
  } catch (error) {
    logger?.error(`${_functionName}: ${error.message}`);

    return null;
  }
}
