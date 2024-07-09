import { sign } from 'tweetnacl';
import browser from 'webextension-polyfill';

// errors
import { MalformedDataError } from '@extension/errors';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// types
import type { IOptions } from './types';

// utils
import fetchDecryptedKeyPairFromStorageWithPassword from '@extension/utils/fetchDecryptedKeyPairFromStorageWithPassword';

/**
 * Convenience function that signs an arbitrary bit of data using the supplied signer.
 * @param {IOptions} options - the arbitrary bit of data, the signer's hex-encoded public key and the password.
 * @returns {Promise<Uint8Array>} the signature for the signed data.
 * @throws {MalformedDataError} if the data could not be decoded or the signer address is malformed.
 * @throws {DecryptionError} if there was a problem decrypting the private key with password.
 * @throws {InvalidPasswordError} if the password is not valid.
 */
export default async function signBytes({
  bytes,
  logger,
  password,
  publicKey,
}: IOptions): Promise<Uint8Array> {
  const _functionName = 'signBytes';
  let keyPair: Ed21559KeyPair | null;
  let signature: Uint8Array;

  keyPair = await fetchDecryptedKeyPairFromStorageWithPassword({
    logger,
    password,
    publicKey,
  });

  if (!keyPair) {
    throw new MalformedDataError(`failed to get private key from storage`);
  }

  try {
    signature = sign.detached(bytes, keyPair.getSecretKey());

    return signature;
  } catch (error) {
    logger?.error(`${_functionName}:`, error);

    throw new MalformedDataError(error.message);
  }
}
