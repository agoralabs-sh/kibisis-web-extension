import { secretbox } from 'tweetnacl';

// constants
import { SALT_BYTES_SIZE } from '@extension/constants';

// errors
import { EncryptionError } from '@extension/errors';

// types
import type { IBaseOptions } from '@common/types';

// utils
import createDerivedKeyFromSecret from '@extension/utils/createDerivedKeyFromSecret';
import generateRandomBytes from '@extension/utils/generateRandomBytes';

/**
 * Encrypts some data using the supplied secret.
 * @param {Uint8Array} data - the data to encrypt.
 * @param {string} secret - a secret used to encrypt the data.
 * @param {IBaseOptions} options - options such as the logger.
 * @returns {Promise<Uint8Array>} the data encrypted with the password.
 * @throws {EncryptionError} If the data to be encrypted exceeds 2^39−256 bytes.
 */
export default async function encryptBytes(
  data: Uint8Array,
  secret: string,
  { logger }: IBaseOptions
): Promise<Uint8Array> {
  const _functionName: string = 'encryptBytes';
  const salt: Uint8Array = generateRandomBytes(SALT_BYTES_SIZE);
  const derivedKey: Uint8Array = await createDerivedKeyFromSecret(secret, salt);
  const nonce: Uint8Array = generateRandomBytes(secretbox.nonceLength);
  let encryptedData: Uint8Array;
  let buffer: Uint8Array;

  try {
    encryptedData = secretbox(data, nonce, derivedKey);
  } catch (error) {
    logger?.debug(`${_functionName}(): ${error.message}`);

    throw new EncryptionError(error.message);
  }

  buffer = new Uint8Array(nonce.length + salt.length + encryptedData.length);

  buffer.set(nonce, 0);
  buffer.set(salt, nonce.length);
  buffer.set(new Uint8Array(encryptedData), nonce.length + salt.length);

  return buffer;
}
