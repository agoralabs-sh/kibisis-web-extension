import { encodeAddress } from 'algosdk';
import { sign } from 'tweetnacl';

// types
import { IBaseOptions } from '@common/types';

/**
 * Convenience function simply extracts the address from a private key.
 * @param {Uint8Array} privateKey - the private key as bytes.
 * @param {IBaseOptions} options - [optional] optional options.
 * @returns {string} the address for a given private key, or null.
 */
export default function convertPrivateKeyToAddress(
  privateKey: Uint8Array,
  options?: IBaseOptions
): string | null {
  const _functionName: string = 'convertPrivateKeyToAddress';

  try {
    const publicKey: Uint8Array =
      sign.keyPair.fromSecretKey(privateKey).publicKey;

    return encodeAddress(publicKey);
  } catch (error) {
    options?.logger &&
      options.logger.error(`${_functionName}(): ${error.message}`);

    return null;
  }
}
