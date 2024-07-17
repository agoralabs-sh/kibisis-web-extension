import browser from 'webextension-polyfill';

// errors
import { InvalidPasswordError } from '@extension/errors';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// services
import PasswordService from '@extension/services/PasswordService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IPrivateKey } from '@extension/types';
import type { IOptions } from './types';

/**
 * Convenience function that fetches the private key from storage and converts it to a key pair using the password.
 * @param {IOptions} options - the password and the public key.
 * @returns {Promise<Ed21559KeyPair | null>} a promise that resolves to the key pair or null if there was no private key
 * associated with the public key in storage.
 * @throws {InvalidPasswordError} if the password is invalid.
 * @throws {DecryptionError} if the private key failed to be decrypted with the supplied password.
 */
export default async function fetchDecryptedKeyPairFromStorageWithPassword({
  logger,
  password,
  passwordService,
  privateKeyService,
  publicKey,
}: IOptions): Promise<Ed21559KeyPair | null> {
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
  let decryptedPrivateKey: Uint8Array;
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

  // this is the legacy version, we need to convert the "secret key" to a private key
  if (privateKeyItem.version <= 0) {
    decryptedPrivateKey = await PasswordService.decryptBytes({
      data: PrivateKeyService.decode(privateKeyItem.encryptedPrivateKey),
      logger,
      password,
    });

    return Ed21559KeyPair.generateFromPrivateKey(
      PrivateKeyService.extractPrivateKeyFromSecretKey(decryptedPrivateKey)
    );
  }

  decryptedPrivateKey = await PasswordService.decryptBytes({
    data: PrivateKeyService.decode(privateKeyItem.encryptedPrivateKey),
    logger,
    password,
  });

  return Ed21559KeyPair.generateFromPrivateKey(decryptedPrivateKey);
}
