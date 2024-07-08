import browser from 'webextension-polyfill';

// errors
import { InvalidPasswordError } from '@extension/errors';

// services
import PasswordService from '@extension/services/PasswordService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IPrivateKey } from '@extension/types';
import type { IOptions } from './types';

/**
 * Convenience function that fetches a raw private key from storage from a hexadecimal encoded public key.
 * @param {IOptions} options - the password and the public key.
 * @returns {Promise<Uint8Array | null>} a promise that resolves to the raw decrypted private key or null if there was
 * no private key associated with the public key.
 * @throws {InvalidPasswordError} if the password is invalid.
 * @throws {DecryptionError} if the private key failed to be decrypted with the supplied password.
 */
export default async function fetchDecryptedPrivateKeyWithPassword({
  logger,
  password,
  passwordService,
  privateKeyService,
  publicKey,
}: IOptions): Promise<Uint8Array | null> {
  const _functionName = 'fetchDecryptedPrivateKeyWithPassword';
  const _passwordService =
    passwordService ||
    new PasswordService({
      logger,
      passwordTag: browser.runtime.id,
    });
  const _privateKeyService =
    privateKeyService ||
    new PrivateKeyService({
      logger,
    });
  const isPasswordValid = await _passwordService.verifyPassword(password);
  let _publicKey: string;
  let privateKeyItem: IPrivateKey | null;

  if (!isPasswordValid) {
    logger?.debug(`${_functionName}: invalid password`);

    throw new InvalidPasswordError();
  }

  _publicKey =
    typeof publicKey !== 'string'
      ? PrivateKeyService.encode(publicKey)
      : publicKey; // encode the public key if it isn't already
  privateKeyItem = await _privateKeyService.fetchFromStorageByPublicKey(
    _publicKey
  );

  if (!privateKeyItem) {
    logger?.debug(
      `${_functionName}: no private key stored for public key "${_publicKey}"`
    );

    return null;
  }

  logger?.debug(
    `${_functionName}: decrypting private key for public key "${_publicKey}"`
  );

  return PasswordService.decryptBytes({
    data: PrivateKeyService.decode(privateKeyItem.encryptedPrivateKey),
    logger,
    password,
  });
}
