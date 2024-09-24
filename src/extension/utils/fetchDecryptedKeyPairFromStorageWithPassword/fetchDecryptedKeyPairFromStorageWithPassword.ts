import browser from 'webextension-polyfill';

// enums
import { EncryptionMethodEnum } from '@extension/enums';

// errors
import { InvalidPasswordError } from '@extension/errors';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// managers
import PasswordManager from '@extension/managers/PasswordManager';

// repositories
import PasswordTagRepository from '@extension/repositories/PasswordTagRepository';
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';

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
  passwordTagRepository,
  privateKeyRepository,
  publicKey,
}: IOptions): Promise<Ed21559KeyPair | null> {
  const _functionName = 'fetchDecryptedPrivateKeyWithPassword';
  const _passwordTagRepository =
    passwordTagRepository || new PasswordTagRepository();
  const _privateKeyRepository =
    privateKeyRepository || new PrivateKeyRepository();
  const passwordManager = new PasswordManager({
    logger,
    passwordTag: browser.runtime.id,
    passwordTagRepository: _passwordTagRepository,
  });
  const isPasswordValid = await passwordManager.verifyPassword(password);
  let _publicKey: string;
  let decryptedPrivateKey: Uint8Array;
  let privateKeyItem: IPrivateKey | null;

  if (!isPasswordValid) {
    logger?.debug(`${_functionName}: invalid password`);

    throw new InvalidPasswordError();
  }

  _publicKey =
    typeof publicKey !== 'string'
      ? PrivateKeyRepository.encode(publicKey)
      : publicKey; // encode the public key if it isn't already
  privateKeyItem = await _privateKeyRepository.fetchByPublicKey(_publicKey);

  if (!privateKeyItem) {
    logger?.debug(
      `${_functionName}: no private key stored for public key "${_publicKey}"`
    );

    return null;
  }

  privateKeyItem = await PrivateKeyRepository.upgrade({
    encryptionCredentials: {
      password,
      type: EncryptionMethodEnum.Password,
    },
    logger,
    privateKeyItem,
  });

  logger?.debug(
    `${_functionName}: decrypting private key for public key "${_publicKey}"`
  );

  decryptedPrivateKey = await PasswordManager.decryptBytes({
    bytes: PrivateKeyRepository.decode(privateKeyItem.encryptedPrivateKey),
    logger,
    password,
  });

  return Ed21559KeyPair.generateFromPrivateKey(decryptedPrivateKey);
}
