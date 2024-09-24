import { decode as decodeUtf8, encode as encodeUtf8 } from '@stablelib/utf8';
import scrypt from 'scrypt-async';
import { hash, randomBytes, secretbox } from 'tweetnacl';

// constants
import { SALT_BYTES_SIZE } from '@extension/constants';

// errors
import {
  DecryptionError,
  EncryptionError,
  InvalidPasswordError,
  MalformedDataError,
} from '@extension/errors';

// repositories
import PasswordTagRepository from '@extension/repositories/PasswordTagRepository';

// types
import type { IBaseOptions, ILogger } from '@common/types';
import type { IPasswordTag } from '@extension/types';
import type {
  ICreateDerivedKeyFromPasswordOptions,
  IDecryptAndEncryptBytesOptions,
  INewOptions,
  ISaveNewPasswordOptions,
} from './types';

export default class PasswordManager {
  // private variables
  private readonly _logger: ILogger | null;
  private readonly _passwordTag: string;
  private readonly _passwordTagRepository: PasswordTagRepository;

  constructor({
    logger,
    passwordTag,
    passwordTagRepository,
  }: INewOptions & IBaseOptions) {
    this._logger = logger || null;
    this._passwordTag = passwordTag;
    this._passwordTagRepository =
      passwordTagRepository || new PasswordTagRepository();
  }

  /**
   * private static functions
   */

  /**
   * Generates a hashed key derivation using for a password using a salt.
   * @param {ICreateDerivedKeyFromPasswordOptions} options - the password and the salt.
   * @returns {Promise<Uint8Array>} a promise that resolves to the derived encryption key.
   * @private
   * @static
   */
  private static _createDerivedKeyFromPassword({
    password,
    salt,
  }: ICreateDerivedKeyFromPasswordOptions): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve) => {
      const hashedSecret: Uint8Array = hash(encodeUtf8(password));

      scrypt(
        hashedSecret,
        salt,
        {
          N: 16384, // cpu/memory cost parameter (must be power of two; alternatively, you can specify logN where N = 2^logN).
          r: 8, // block size parameter
          p: 1, // parallelization parameter
          dkLen: secretbox.keyLength, // derived key length
          encoding: 'binary',
        },
        (derivedKey: Uint8Array) => resolve(derivedKey)
      );
    });
  }

  /**
   * public static functions
   */

  /**
   * Decrypts some data using the supplied password to derive an encryption key.
   * @param {IDecryptAndEncryptBytesOptions} options - the IV + salt + encrypted data as bytes and a password to seed the
   * encryption key.
   * @returns {Promise<Uint8Array>} a promise that resolves to the decrypted data.
   * @throws {DecryptionError} If the encrypted data is malformed, or the password is invalid.
   * @public
   * @static
   */
  public static async decryptBytes({
    bytes,
    logger,
    password,
  }: IDecryptAndEncryptBytesOptions & IBaseOptions): Promise<Uint8Array> {
    const _functionName = 'decryptBytes';
    const [nonce, salt, encryptedBytes] = [
      bytes.slice(0, secretbox.nonceLength),
      bytes.slice(
        secretbox.nonceLength,
        secretbox.nonceLength + SALT_BYTES_SIZE
      ),
      bytes.slice(secretbox.nonceLength + SALT_BYTES_SIZE),
    ];
    let _error: string;
    let encryptionKey: Uint8Array;
    let decryptedData: Uint8Array | null;

    if (!nonce || nonce.byteLength !== secretbox.nonceLength) {
      throw new DecryptionError('invalid nonce');
    }

    if (!salt || salt.byteLength !== SALT_BYTES_SIZE) {
      throw new DecryptionError('invalid salt');
    }

    encryptionKey = await PasswordManager._createDerivedKeyFromPassword({
      password,
      salt,
      logger,
    });
    decryptedData = secretbox.open(encryptedBytes, nonce, encryptionKey);

    if (!decryptedData) {
      _error = 'failed to decrypt key';

      logger?.debug(`${_functionName}: ${_error}`);

      throw new DecryptionError(_error);
    }

    return decryptedData;
  }

  /**
   * Encrypts some data using the supplied password to derive an encryption key.
   * @param {IDecryptAndEncryptBytesOptions} options - the data to encrypt and a password to seed the encryption key.
   * @returns {Promise<Uint8Array>} a promise that resolves to the encrypted data.
   * @throws {EncryptionError} If the data to be encrypted exceeds 2^39−256 bytes.
   * @public
   * @static
   */
  public static async encryptBytes({
    bytes,
    logger,
    password,
  }: IDecryptAndEncryptBytesOptions & IBaseOptions): Promise<Uint8Array> {
    const _functionName = 'encryptBytes';
    const salt = randomBytes(SALT_BYTES_SIZE);
    const encryptionKey = await PasswordManager._createDerivedKeyFromPassword({
      logger,
      password,
      salt,
    });
    const nonce = randomBytes(secretbox.nonceLength);
    let encryptedBytes: Uint8Array;
    let buffer: Uint8Array;

    try {
      encryptedBytes = secretbox(bytes, nonce, encryptionKey);
    } catch (error) {
      logger?.error(`${_functionName}:`, error);

      throw new EncryptionError(error.message);
    }

    buffer = new Uint8Array(nonce.length + salt.length + encryptedBytes.length);

    buffer.set(nonce, 0);
    buffer.set(salt, nonce.length);
    buffer.set(new Uint8Array(encryptedBytes), nonce.length + salt.length);

    return buffer;
  }

  /**
   * public functions
   */

  public getPasswordTag(): string {
    return this._passwordTag;
  }

  /**
   * Changes the current password to a new password.
   * @param {ISaveNewPasswordOptions} options - the new password and a current password.
   * @returns {Promise<IPasswordTag>} a promise that resolves to the saved password tag.
   * @throws {InvalidPasswordError} if there is an existing password tag and the current password is not supplied, or
   * the current password is invalid.
   * @public
   */
  public async saveNewPassword({
    currentPassword,
    newPassword,
  }: ISaveNewPasswordOptions): Promise<IPasswordTag> {
    const _functionName = 'saveNewPassword';
    const newEncryptedTag = await PasswordManager.encryptBytes({
      bytes: encodeUtf8(this._passwordTag),
      password: newPassword,
      ...(this._logger && {
        logger: this._logger,
      }),
    }); // encrypt the password tag with the new password
    let _error: string;
    let isPasswordValid: boolean;
    let passwordTag = await this._passwordTagRepository.fetch();

    // if there is no password tag
    if (!passwordTag) {
      _error = `attempted to change password, but no previous password tag found`;

      this._logger?.debug(
        `${PasswordManager.name}#${_functionName}: ${_error}`
      );

      throw new MalformedDataError(_error);
    }

    isPasswordValid = await this.verifyPassword(currentPassword);

    if (!isPasswordValid) {
      this._logger?.debug(
        `${PasswordManager.name}#${_functionName}: invalid password`
      );

      throw new InvalidPasswordError();
    }

    this._logger?.debug(
      `${PasswordManager.name}#${_functionName}: saving new password tag to storage`
    );

    return await this._passwordTagRepository.save({
      ...passwordTag,
      encryptedTag: PasswordTagRepository.encode(newEncryptedTag),
    });
  }

  /**
   * Verifies if the supplied password is valid. This function fetches the encrypted password tag from storage and
   * decrypts it using the supplied password. If the decryption is successful, and the password tag matches, the
   * password is valid.
   * @param {string} password - the password to verify.
   * @returns {boolean} true if the password is valid, false otherwise.
   * @public
   */
  public async verifyPassword(password: string): Promise<boolean> {
    const _functionName = 'verifyPassword';
    const passwordTag = await this._passwordTagRepository.fetch();
    let decryptedPasswordTag: Uint8Array;

    if (!passwordTag) {
      this._logger?.debug(
        `${PasswordManager.name}#${_functionName}: no password password tag found`
      );

      return false;
    }

    this._logger?.debug(
      `${PasswordManager.name}#${_functionName}: password tag "${passwordTag.id}" found, attempting to validate`
    );

    try {
      decryptedPasswordTag = await PasswordManager.decryptBytes({
        bytes: PasswordTagRepository.decode(passwordTag.encryptedTag),
        password,
        ...(this._logger && {
          logger: this._logger,
        }),
      });
    } catch (error) {
      this._logger?.debug(
        `${PasswordManager.name}#${_functionName}: failed to decrypt password tag "${passwordTag.id}"`
      );

      return false;
    }

    return decodeUtf8(decryptedPasswordTag) === this._passwordTag;
  }
}
