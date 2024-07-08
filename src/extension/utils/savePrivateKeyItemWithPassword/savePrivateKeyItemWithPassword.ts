import browser from 'webextension-polyfill';

// errors
import { InvalidPasswordError, MalformedDataError } from '@extension/errors';

// services
import PasswordService from '@extension/services/PasswordService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IPasswordTag, IPrivateKey } from '@extension/types';
import type { IOptions } from './types';

/**
 * Convenience function that saves a encrypts a private key and saves it to storage.
 * @param {IOptions} options - the password and the private key.
 * @returns {Promise<Uint8Array | null>} a promise that resolves to the saved private key item or null if the private
 * key failed to save.
 * @throws {InvalidPasswordError} if the password is invalid.
 * @throws {MalformedDataError} if the password tag has not been set, i.e. the extension is not "initialized".
 * @throws {DecryptionError} if the private key failed to be encrypted with the supplied password.
 */
export default async function savePrivateKeyItemWithPassword({
  logger,
  password,
  passwordService,
  privateKey,
  privateKeyService,
}: IOptions): Promise<IPrivateKey | null> {
  const _functionName = 'savePrivateKeyItemWithPassword';
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
  const publicKey =
    PrivateKeyService.extractPublicKeyFromPrivateKey(privateKey);
  let _error: string;
  let encryptedPrivateKey: Uint8Array;
  let passwordTagItem: IPasswordTag | null;
  let privateKeyItem: IPrivateKey | null;

  if (!isPasswordValid) {
    logger?.debug(`${_functionName}: invalid password`);

    throw new InvalidPasswordError();
  }

  privateKeyItem = await _privateKeyService.fetchFromStorageByPublicKey(
    PrivateKeyService.encode(publicKey)
  );

  if (!privateKeyItem) {
    logger?.debug(
      `${_functionName}: key for "${PrivateKeyService.encode(
        publicKey
      )}" (public key) doesn't exist, creating a new one`
    );

    passwordTagItem = await _passwordService.fetchFromStorage();

    if (!passwordTagItem) {
      _error = `failed to get password tag from storage`;

      logger?.debug(`${_functionName}: ${_error}`);

      throw new MalformedDataError(_error);
    }

    // encrypt the private key and add it to storage.
    encryptedPrivateKey = await PasswordService.encryptBytes({
      data: privateKey,
      logger,
      password,
    });
    privateKeyItem = await _privateKeyService.saveToStorage(
      PrivateKeyService.createPrivateKey({
        encryptedPrivateKey,
        passwordTagId: passwordTagItem.id,
        publicKey,
      })
    );
  }

  return privateKeyItem;
}
