import { decode as decodeHex, encode as encodeHex } from '@stablelib/hex';
import { decode as decodeUtf8, encode as encodeUtf8 } from '@stablelib/utf8';
import scrypt from 'scrypt-async';
import { hash, randomBytes, secretbox } from 'tweetnacl';
import { v4 as uuid } from 'uuid';

// constants
import { PASSWORD_TAG_ITEM_KEY, SALT_BYTES_SIZE } from '@extension/constants';

// errors
import {
  DecryptionError,
  EncryptionError,
  InvalidPasswordError,
  MalformedDataError,
} from '@extension/errors';

// services
import StorageManager from '../StorageManager';

// types
import type { ILogger } from '@common/types';
import type { IPasswordTag } from '@extension/types';
import type {
  ICreatePasswordTagOptions,
  IDecryptAndEncryptBytesOptions,
  IGenerateEncryptionKeyFromPasswordOptions,
  INewOptions,
  ISaveNewPasswordOptions,
} from './types';

export default class PasswordService {
  // public static variables
  public static readonly version: number = 0;

  // private variables
  private readonly logger: ILogger | null;
  private readonly passwordTag: string;
  private readonly storageManager: StorageManager;

  constructor({ logger, passwordTag, storageManager }: INewOptions) {
    this.logger = logger || null;
    this.passwordTag = passwordTag;
    this.storageManager = storageManager || new StorageManager();
  }

  /**
   * private static functions
   */

  /**
   * Generates a hashed key derivation using for a password using a salt.
   * @param {IGenerateEncryptionKeyFromPasswordOptions} options - the password and the salt.
   * @returns {Promise<Uint8Array>} a promise that resolves to the derived encryption key.
   * @private
   * @static
   */
  private static _createDerivedKeyFromPassword({
    password,
    salt,
  }: IGenerateEncryptionKeyFromPasswordOptions): Promise<Uint8Array> {
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
   * Convenience function that creates a password tag item.
   * @param {ICreatePasswordTagOptions} options - the raw encrypted tag.
   * @returns {IPasswordTag} an initialized password tag item.
   * @public
   * @static
   */
  public static createPasswordTag({
    encryptedTag,
  }: ICreatePasswordTagOptions): IPasswordTag {
    return {
      encryptedTag: encodeHex(encryptedTag),
      id: uuid(),
      version: PasswordService.version,
    };
  }

  /**
   * Convenience that decodes the password tag from hexadecimal.
   * @param {string} encodedKey - the hexadecimal password tag to decode.
   * @returns {Uint8Array} the decoded password tag.
   * @public
   * @static
   */
  public static decode(encodedKey: string): Uint8Array {
    return decodeHex(encodedKey);
  }

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
    data,
    logger,
    password,
  }: IDecryptAndEncryptBytesOptions): Promise<Uint8Array> {
    const _functionName = 'decryptBytes';
    const [nonce, salt, encryptedData] = [
      data.slice(0, secretbox.nonceLength),
      data.slice(
        secretbox.nonceLength,
        secretbox.nonceLength + SALT_BYTES_SIZE
      ),
      data.slice(secretbox.nonceLength + SALT_BYTES_SIZE),
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

    encryptionKey = await PasswordService._createDerivedKeyFromPassword({
      password,
      salt,
      logger,
    });
    decryptedData = secretbox.open(encryptedData, nonce, encryptionKey);

    if (!decryptedData) {
      _error = 'failed to decrypt key';

      logger?.debug(`${_functionName}: ${_error}`);

      throw new DecryptionError(_error);
    }

    return decryptedData;
  }

  /**
   * Convenience that encodes a password tag to uppercase hexadecimal.
   * @param {Uint8Array} key - the password tag to encode.
   * @returns {string} the password tag encoded to uppercase hexadecimal.
   * @public
   * @static
   */
  public static encode(key: Uint8Array): string {
    return encodeHex(key);
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
    data,
    logger,
    password,
  }: IDecryptAndEncryptBytesOptions): Promise<Uint8Array> {
    const _functionName = 'encryptBytes';
    const salt: Uint8Array = randomBytes(SALT_BYTES_SIZE);
    const encryptionKey = await PasswordService._createDerivedKeyFromPassword({
      logger,
      password,
      salt,
    });
    const nonce = randomBytes(secretbox.nonceLength);
    let encryptedData: Uint8Array;
    let buffer: Uint8Array;

    try {
      encryptedData = secretbox(data, nonce, encryptionKey);
    } catch (error) {
      logger?.error(`${_functionName}:`, error);

      throw new EncryptionError(error.message);
    }

    buffer = new Uint8Array(nonce.length + salt.length + encryptedData.length);

    buffer.set(nonce, 0);
    buffer.set(salt, nonce.length);
    buffer.set(new Uint8Array(encryptedData), nonce.length + salt.length);

    return buffer;
  }

  /**
   * public functions
   */

  /**
   * Fetches the password tag from storage.
   * @returns {Promise<IPasswordTag | null>} a promise that resolves to the password tag or null if no password tag in
   * storage.
   * @public
   */
  public async fetchFromStorage(): Promise<IPasswordTag | null> {
    return await this.storageManager.getItem<IPasswordTag>(
      PASSWORD_TAG_ITEM_KEY
    );
  }

  public getPasswordTag(): string {
    return this.passwordTag;
  }

  /**
   * Removes the stored password tag from storage.
   * @public
   */
  public async removeFromStorage(): Promise<void> {
    return await this.storageManager.remove(PASSWORD_TAG_ITEM_KEY);
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
    const newEncryptedTag = await PasswordService.encryptBytes({
      data: encodeUtf8(this.passwordTag),
      password: newPassword,
      ...(this.logger && {
        logger: this.logger,
      }),
    }); // encrypt the password tag with the new password
    let _error: string;
    let isPasswordValid: boolean;
    let passwordTag = await this.fetchFromStorage();

    // if there is no password tag
    if (!passwordTag) {
      _error = `attempted to change password, but no previous password tag found`;

      this.logger?.debug(`${PasswordService.name}#${_functionName}: ${_error}`);

      throw new MalformedDataError(_error);
    }

    isPasswordValid = await this.verifyPassword(currentPassword);

    if (!isPasswordValid) {
      this.logger?.debug(
        `${PasswordService.name}#${_functionName}: invalid password`
      );

      throw new InvalidPasswordError();
    }

    this.logger?.debug(
      `${PasswordService.name}#${_functionName}: saving new password tag to storage`
    );

    return await this.saveToStorage({
      ...passwordTag,
      encryptedTag: encodeHex(newEncryptedTag),
    });
  }

  /**
   * Saves the password tag to storage. This will overwrite the current password tag.
   * @param {IPasswordTag} passwordTag - the credential to save.
   * @returns {Promise<IPasskeyCredential>} a promise that resolves to the saved password tag.
   * @public
   */
  public async saveToStorage(passwordTag: IPasswordTag): Promise<IPasswordTag> {
    await this.storageManager.setItems({
      [PASSWORD_TAG_ITEM_KEY]: passwordTag,
    });

    return passwordTag;
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
    const passwordTag = await this.fetchFromStorage();
    let decryptedPasswordTag: Uint8Array;

    if (!passwordTag) {
      this.logger?.debug(
        `${PasswordService.name}#${_functionName}: no password password tag found`
      );

      return false;
    }

    this.logger?.debug(
      `${PasswordService.name}#${_functionName}: password tag "${passwordTag.id}" found, attempting to validate`
    );

    try {
      decryptedPasswordTag = await PasswordService.decryptBytes({
        data: decodeHex(passwordTag.encryptedTag),
        password,
        ...(this.logger && {
          logger: this.logger,
        }),
      });
    } catch (error) {
      this.logger?.debug(
        `${PasswordService.name}#${_functionName}: failed to decrypt password tag "${passwordTag.id}"`
      );

      return false;
    }

    return decodeUtf8(decryptedPasswordTag) === this.passwordTag;
  }
}
