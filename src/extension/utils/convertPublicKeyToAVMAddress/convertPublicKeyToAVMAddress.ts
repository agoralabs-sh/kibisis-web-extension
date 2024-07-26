import { encodeAddress } from 'algosdk';

// services
import PrivateKeyService from '@extension/services/PrivateKeyService';

/**
 * Convenience function that simply converts a public key to a base32 encoded AVM address.
 * @param {Uint8Array | } publicKey - a raw or hexadecimal encoded public key.
 * @returns {string} a base32 encoded AVM address derived from a public key.
 */
export default function convertPublicKeyToAVMAddress(
  publicKey: Uint8Array | string
): string {
  if (typeof publicKey === 'string') {
    return encodeAddress(PrivateKeyService.decode(publicKey));
  }

  return encodeAddress(publicKey);
}
