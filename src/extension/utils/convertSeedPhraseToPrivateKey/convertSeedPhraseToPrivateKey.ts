import { seedFromMnemonic } from 'algosdk';

// errors
import { DecodingError } from '@extension/errors';

// types
import type { IOptions } from './types';

/**
 * Convenience function that simply converts a 25 word seed phrase to a private key.
 * @param {IOptions} options - a 25 word mnemonic seed phrase.
 * @returns {string} the seed phrase.
 * @throws {DecodingError} if the seed phrase has an incorrect checksum, if the number of words is unexpected, or if
 * one of the passed words is not found in the AVM words list.
 */
export default function convertSeedPhraseToPrivateKey({
  logger,
  seedPhrase,
}: IOptions): Uint8Array {
  const _functionName = 'convertSeedPhraseToPrivateKey';

  try {
    return seedFromMnemonic(seedPhrase);
  } catch (error) {
    logger?.error(`${_functionName}:`, error);

    throw new DecodingError(error.message);
  }
}
