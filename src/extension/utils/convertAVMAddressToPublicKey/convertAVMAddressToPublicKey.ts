import { decodeAddress } from 'algosdk';

/**
 * Convenience function that simply converts a base32 encoded AVM address to a public key.
 * @param {string} address - the base32 encoded AVM address to convert.
 * @returns {Uint8Array} the public key from the AVM address.
 */
export default function convertAVMAddressToPublicKey(
  address: string
): Uint8Array {
  return decodeAddress(address).publicKey;
}
