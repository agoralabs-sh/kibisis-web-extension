import { randomBytes } from 'tweetnacl';

/**
 * Convenience function that generates a random amount of bytes.
 * @param {number} size - [optional] the number of random bytes to generate. Defaults to 32.
 * @returns {Uint8Array} random bytes defined by the size.
 */
export default function generateRandomBytes(size: number = 32): Uint8Array {
  return randomBytes(size);
}
