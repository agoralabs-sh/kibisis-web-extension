import { sign } from 'tweetnacl';
import browser from 'webextension-polyfill';

// errors
import { DecryptionError, MalformedDataError } from '@extension/errors';

// services
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IOptions } from './types';

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
  const _functionName: string = 'signBytes';
  const privateKeyService: PrivateKeyService = new PrivateKeyService({
    logger,
    passwordTag: browser.runtime.id,
  });
  let errorMessage: string;
  let privateKey: Uint8Array | null;
  let signature: Uint8Array;

  privateKey = await privateKeyService.getDecryptedPrivateKey(
    publicKey,
    password
  );

  if (!privateKey) {
    errorMessage = `failed to get private key`;

    logger?.error(errorMessage);

    throw new DecryptionError(errorMessage);
  }

  try {
    signature = sign.detached(bytes, privateKey);

    return signature;
  } catch (error) {
    logger?.error(`${_functionName}: ${error.message}`);

    throw new MalformedDataError(error.message);
  }
}
