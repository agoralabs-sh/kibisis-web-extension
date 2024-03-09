import { decode as decodeBase64 } from '@stablelib/base64';
import { encode as encodeHex } from '@stablelib/hex';

/**
 * Convenience function that converts a base64 encoded genesis hash to hex that is used for indexing in storage.
 * @param {string} input - the base64 encoded genesis hash.
 * @returns {string} a hex encoded version of the genesis hash.
 */
export default function convertGenesisHashToHex(input: string): string {
  return encodeHex(decodeBase64(input)).toUpperCase();
}
