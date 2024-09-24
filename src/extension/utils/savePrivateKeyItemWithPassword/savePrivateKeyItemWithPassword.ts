import browser from 'webextension-polyfill';

// enums
import { EncryptionMethodEnum } from '@extension/enums';

// errors
import { InvalidPasswordError, MalformedDataError } from '@extension/errors';

// managers
import PasswordManager from '@extension/managers/PasswordManager';

// repositories
import PasswordTagRepository from '@extension/repositories/PasswordTagRepository';
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';

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
  passwordTagRepository,
  privateKeyRepository,
  saveUnencryptedPrivateKey = false,
}: IOptions): Promise<IPrivateKey | null> {
  const _functionName = 'savePrivateKeyItemWithPassword';
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
  let _error: string;
  let encryptedPrivateKey: Uint8Array;
  let passwordTagItem: IPasswordTag | null;
  let privateKeyItem: IPrivateKey | null;

  if (!isPasswordValid) {
    logger?.debug(`${_functionName}: invalid password`);

    throw new InvalidPasswordError();
  }

  privateKeyItem = await _privateKeyRepository.fetchByPublicKey(
    keyPair.publicKey
  );

  if (!privateKeyItem) {
    logger?.debug(
      `${_functionName}: key for "${PrivateKeyRepository.encode(
        keyPair.publicKey
      )}" (public key) doesn't exist, creating a new one`
    );

    passwordTagItem = await _passwordTagRepository.fetch();

    if (!passwordTagItem) {
      _error = `failed to get password tag from storage`;

      logger?.debug(`${_functionName}: ${_error}`);

      throw new MalformedDataError(_error);
    }

    // encrypt the private key and add it to storage.
    encryptedPrivateKey = await PasswordManager.encryptBytes({
      bytes: keyPair.privateKey,
      logger,
      password,
    });
    privateKeyItem = await _privateKeyRepository.save(
      PrivateKeyRepository.create({
        encryptedPrivateKey,
        encryptionID: passwordTagItem.id,
        encryptionMethod: EncryptionMethodEnum.Password,
        publicKey: keyPair.publicKey,
        ...(saveUnencryptedPrivateKey && {
          privateKey: keyPair.privateKey,
        }),
      })
    );
  }

  return privateKeyItem;
}
