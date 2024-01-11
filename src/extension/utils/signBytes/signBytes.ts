import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';
import { Address, decodeAddress, signBytes as algoSignBytes } from 'algosdk';
import browser from 'webextension-polyfill';

// errors
import { DecryptionError, MalformedDataError } from '@extension/errors';

// services
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IOptions } from './types';

/**
 * Convenience function that signs a base64 encoded arbitrary bit of data using the private key of the supplied signer.
 * @param {IOptions} options - the base64 encoded arbitrary bit of data, the signer and the password.
 * @returns {Promise<string>} the signature for the signed data.
 * @throws {MalformedDataError} if the data could not be decoded or the signer address is malformed.
 * @throws {DecryptionError} if there was a problem decrypting the private key with password.
 * @throws {InvalidPasswordError} if the password is not valid.
 */
export default async function signBytes({
  encodedData,
  logger,
  password,
  signer,
}: IOptions): Promise<string> {
  const _functionName: string = 'signBytes';
  const privateKeyService: PrivateKeyService = new PrivateKeyService({
    logger,
    passwordTag: browser.runtime.id,
  });
  let bytes: Uint8Array;
  let decodedAddress: Address;
  let errorMessage: string;
  let privateKey: Uint8Array | null;
  let signature: Uint8Array;

  try {
    bytes = decodeBase64(encodedData);
  } catch (error) {
    logger?.error(`${_functionName}(): ${error.message}`);

    throw new MalformedDataError(error.message);
  }

  logger?.debug(`${_functionName}(): converted base64 data to bytes`);

  try {
    decodedAddress = decodeAddress(signer);
  } catch (error) {
    logger?.error(`${_functionName}(): ${error.message}`);

    throw new MalformedDataError(error.message);
  }

  privateKey = await privateKeyService.getDecryptedPrivateKey(
    decodedAddress.publicKey,
    password
  );

  if (!privateKey) {
    errorMessage = `failed to get private key for signer "${signer}"`;

    logger?.error(errorMessage);

    throw new DecryptionError(errorMessage);
  }

  logger?.debug(`${_functionName}(): decrypted private key for "${signer}"`);

  try {
    signature = algoSignBytes(bytes, privateKey);

    logger?.debug(`${_functionName}(): signed bytes with signer "${signer}"`);

    return encodeBase64(signature);
  } catch (error) {
    logger?.error(`${_functionName}(): ${error.message}`);

    throw new MalformedDataError(error.message);
  }
}
