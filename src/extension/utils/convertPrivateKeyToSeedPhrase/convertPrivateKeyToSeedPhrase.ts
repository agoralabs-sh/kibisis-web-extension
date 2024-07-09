import { mnemonicFromSeed } from 'algosdk';

// errors
import { EncodingError } from '@extension/errors';

// types
import type { IOptions } from './types';

/**
 * Convenience function that simply converts a 32-byte private key into a 25 word seed phrase. The generated mnemonic
 * contains 25 words where each mnemonic word represents 11 bits of data, and the last word 11 bits is reserved for
 * a checksum.
 * @param {IOptions} options - a 32-byte private key.
 * @returns {string} the seed phrase.
 * @throws {EncodingError} if teh private key is not the correct byte length.
 */
export default function convertPrivateKeyToSeedPhrase({
  logger,
  privateKey,
}: IOptions): string {
  const _functionName = 'convertPrivateKeyToSeedPhrase';

  try {
    return mnemonicFromSeed(privateKey);
  } catch (error) {
    logger?.error(`${_functionName}:`, error);

    throw new EncodingError(error.message);
  }
}
