import browser from 'webextension-polyfill';

// enums
import { EncryptionMethodEnum } from '@extension/enums';

// errors
import { InvalidPasswordError, MalformedDataError } from '@extension/errors';

// services
import PasswordService from '@extension/services/PasswordService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IPasswordTag, IPrivateKey } from '@extension/types';
import type { IOptions } from './types';

/**
 * Convenience function that encrypts a private key with the password and saves it to storage.
 * @param {IOptions} options - the password and the key pair.
 * @returns {Promise<Uint8Array | null>} a promise that resolves to the saved private key item or null if the private
 * key failed to save.
 * @throws {InvalidPasswordError} if the password is invalid.
 * @throws {MalformedDataError} if the password tag has not been set, i.e. the extension is not "initialized".
 * @throws {DecryptionError} if the private key failed to be encrypted with the supplied password.
 */
export default async function savePrivateKeyItemWithPassword({
  keyPair,
  logger,
  password,
  passwordService,
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
  let _error: string;
  let encryptedPrivateKey: Uint8Array;
  let passwordTagItem: IPasswordTag | null;
  let privateKeyItem: IPrivateKey | null;

  if (!isPasswordValid) {
    logger?.debug(`${_functionName}: invalid password`);

    throw new InvalidPasswordError();
  }

  privateKeyItem = await _privateKeyService.fetchFromStorageByPublicKey(
    keyPair.publicKey
  );

  if (!privateKeyItem) {
    logger?.debug(
      `${_functionName}: key for "${PrivateKeyService.encode(
        keyPair.publicKey
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
      data: keyPair.privateKey,
      logger,
      password,
    });
    privateKeyItem = await _privateKeyService.saveToStorage(
      PrivateKeyService.create({
        encryptedPrivateKey,
        encryptionID: passwordTagItem.id,
        encryptionMethod: EncryptionMethodEnum.Password,
        publicKey: keyPair.publicKey,
      })
    );
  }

  return privateKeyItem;
}
