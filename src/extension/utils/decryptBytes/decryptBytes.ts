import { secretbox } from 'tweetnacl';

// constants
import { SALT_BYTES_SIZE } from '@extension/constants';

// errors
import { DecryptionError } from '@extension/errors';

// types
import type { IBaseOptions } from '@common/types';

// utils
import createDerivedKeyFromSecret from '@extension/utils/createDerivedKeyFromSecret';

/**
 * Decrypts some data using the supplied password.
 * @param {Uint8Array} data - the IV + salt + encrypted data as bytes.
 * @param {string} secret - the secret used to decrypt the data.
 * @param {IBaseOptions} options - options such as the logger.
 * @returns {Promise<Uint8Array>} the decrypted data.
 * @throws {DecryptionError} If the encrypted data is malformed, or the password is invalid.
 */
export default async function decryptBytes(
  data: Uint8Array,
  secret: string,
  { logger }: IBaseOptions
): Promise<Uint8Array> {
  const _functionName: string = 'decryptBytes';
  const [nonce, salt, encryptedData] = [
    data.slice(0, secretbox.nonceLength),
    data.slice(secretbox.nonceLength, secretbox.nonceLength + SALT_BYTES_SIZE),
    data.slice(secretbox.nonceLength + SALT_BYTES_SIZE),
  ];
  let derivedKey: Uint8Array;
  let decryptedData: Uint8Array | null;
  let errorMessage: string;

  if (!nonce || nonce.byteLength !== secretbox.nonceLength) {
    throw new DecryptionError('invalid nonce');
  }

  if (!salt || salt.byteLength !== SALT_BYTES_SIZE) {
    throw new DecryptionError('invalid salt');
  }

  derivedKey = await createDerivedKeyFromSecret(secret, salt);
  decryptedData = secretbox.open(encryptedData, nonce, derivedKey);

  if (!decryptedData) {
    errorMessage = 'failed to decrypt key';

    logger?.debug(`${_functionName}(): ${errorMessage}`);

    throw new DecryptionError(errorMessage);
  }

  return decryptedData;
}
