import { v4 as uuid } from 'uuid';

// Errors
import {
  DecryptionError,
  EncryptionError,
  InvalidPasswordError,
} from '../errors';

// Services
import StorageManager from './StorageManager';

// Utils
import { bytesToHexString, hexStringToBytes } from '../utils';

// Types
import type {
  IBaseOptions,
  ILogger,
  IPksAccountStorageItem,
  IPksPasswordTagStorageItem,
  ISetAccountOptions,
} from '../types';

interface INewOptions extends IBaseOptions {
  storageManager?: StorageManager;
  passwordTag: string;
}

export default class PrivateKeyService {
  // private static variables
  private static readonly ivByteSize: number = 12;
  private static readonly iterations: number = 2500000;
  private static readonly saltByteSize: number = 64;

  // private variables
  private readonly accountPrefix: string = 'pks_account_';
  private readonly logger: ILogger | null;
  private readonly passwordTagKeyName: string = 'pks_password_tag';
  private readonly passwordTag: string;
  private readonly storageManager: StorageManager;

  // public variables
  public readonly version: number = 0;

  constructor({ logger, passwordTag, storageManager }: INewOptions) {
    this.logger = logger || null;
    this.passwordTag = passwordTag;
    this.storageManager = storageManager || new StorageManager();
  }

  /**
   * Private static functions
   */

  private static async createDerivedKeyFromPassword(
    password: string,
    salt: Uint8Array
  ): Promise<CryptoKey> {
    const encoder: TextEncoder = new TextEncoder();
    const baseKey: CryptoKey = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return await window.crypto.subtle.deriveKey(
      {
        hash: 'SHA-512',
        iterations: PrivateKeyService.iterations,
        name: 'PBKDF2',
        salt,
      },
      baseKey,
      {
        length: 256,
        name: 'AES-GCM',
      },
      false,
      ['decrypt', 'encrypt']
    );
  }

  /**
   * Public static functions
   */

  /**
   * Decrypts some data using the supplied password.
   * @param {string} data - the IV + salt + encrypted data as hex string.
   * @param {string} password - the password used to decrypt the data.
   * @param {IBaseOptions} options - options such as the logger.
   * @returns {string} the decrypted data.
   * @throws {DecryptionError} If the encrypted data is malformed, or the password is invalid.
   * @static
   */
  public static async decrypt(
    data: string,
    password: string,
    { logger }: IBaseOptions
  ): Promise<string> {
    const buffer: Uint8Array = hexStringToBytes(data);
    const [iv, salt, encryptedData] = [
      buffer.slice(0, this.ivByteSize),
      buffer.slice(this.ivByteSize, this.ivByteSize + this.saltByteSize),
      buffer.slice(this.ivByteSize + this.saltByteSize),
    ];
    let decoder: TextDecoder;
    let derivedKey: CryptoKey;
    let decryptedData: ArrayBuffer;

    if (!iv || iv.byteLength !== PrivateKeyService.ivByteSize) {
      throw new DecryptionError('invalid initial vector');
    }

    if (!salt || salt.byteLength !== this.saltByteSize) {
      throw new DecryptionError('invalid salt');
    }

    derivedKey = await this.createDerivedKeyFromPassword(password, salt);

    try {
      decryptedData = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv,
        },
        derivedKey,
        encryptedData
      );
    } catch (error) {
      logger &&
        logger.debug(`${PrivateKeyService.name}#decrypt(): ${error.message}`);

      throw new DecryptionError(error.message);
    }

    decoder = new TextDecoder();

    return decoder.decode(decryptedData);
  }

  /**
   * Encrypts some data using the supplied password.
   * @param {string} password - the password used to encrypt the data.
   * @param {string} data - the data to encrypt.
   * @param {IBaseOptions} options - options such as the logger.
   * @throws {EncryptionError} If the data to be encrypted exceeds 2^39−256 bytes.
   * @static
   */
  public static async encrypt(
    password: string,
    data: string,
    { logger }: IBaseOptions
  ): Promise<string> {
    const encoder: TextEncoder = new TextEncoder();
    const iv: Uint8Array = PrivateKeyService.generateRandomBytes(
      PrivateKeyService.ivByteSize
    );
    const salt: Uint8Array = PrivateKeyService.generateRandomBytes(
      PrivateKeyService.saltByteSize
    );
    const derivedKey: CryptoKey =
      await PrivateKeyService.createDerivedKeyFromPassword(password, salt);
    let encryptedData: ArrayBuffer;
    let buffer: Uint8Array;

    try {
      encryptedData = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv,
        },
        derivedKey,
        encoder.encode(data)
      );
    } catch (error) {
      logger &&
        logger.error(`${PrivateKeyService.name}#encrypt(): ${error.message}`);

      throw new EncryptionError(error.message);
    }

    buffer = new Uint8Array(
      iv.byteLength + salt.byteLength + encryptedData.byteLength
    );

    buffer.set(iv, 0);
    buffer.set(salt, iv.byteLength);
    buffer.set(new Uint8Array(encryptedData), iv.byteLength + salt.byteLength);

    return bytesToHexString(buffer);
  }

  /**
   * Convenience function that generates a random amount of bytes.
   * @param {number} size - [optional] the number of random bytes to generate. Defaults to 32.
   * @returns {Uint8Array} random bytes defined by the size.
   * @static
   */
  public static generateRandomBytes(size: number = 32): Uint8Array {
    return window.crypto.getRandomValues(new Uint8Array(size));
  }

  /**
   * Private functions
   */

  /**
   * Convenience function that simply creates the account item key.
   * @param {string} publicKey - the public key of the account.
   * @returns {string} the account item key.
   */
  public createAccountItemKey(publicKey: string): string {
    return `${this.accountPrefix}${publicKey}`;
  }

  /**
   * Gets all the accounts from storage.
   * @returns {Promise<IPksAccountStorageItem[]>} all the account sin local storage.
   * @private
   */
  private async getAccounts(): Promise<IPksAccountStorageItem[]> {
    const items: Record<string, unknown> =
      await this.storageManager.getAllItems();

    return Object.keys(items).reduce(
      (acc, key) =>
        key.startsWith(this.accountPrefix)
          ? [...acc, items[key] as IPksAccountStorageItem]
          : acc,
      []
    );
  }

  /**
   * Public functions
   */

  /**
   * Gets the decrypted private key from local storage for a given public key.
   * @param {string} publicKey - the public key of the private key.
   * @param {string} password - the password used to encrypt the private key.
   * @returns {string | null} the decrypted private key, or null if no account is stored.
   * @throws {InvalidPasswordError} If the password is invalid.
   * @throws {DecryptionError} If there was a problem with the decryption.
   */
  public async getPrivateKey(
    publicKey: string,
    password: string
  ): Promise<string | null> {
    const isPasswordValid: boolean = await this.verifyPassword(password);
    let account: IPksAccountStorageItem | null;

    if (!isPasswordValid) {
      this.logger &&
        this.logger.debug(
          `${PrivateKeyService.name}#getPrivateKey(): password is invalid`
        );

      throw new InvalidPasswordError();
    }

    account = await this.storageManager.getItem<IPksAccountStorageItem>(
      `${this.accountPrefix}${publicKey}`
    );

    if (!account) {
      this.logger &&
        this.logger.debug(
          `${PrivateKeyService.name}#getPrivateKey(): no account stored for public key "${publicKey}"`
        );

      return null;
    }

    this.logger &&
      this.logger.debug(
        `${PrivateKeyService.name}#getPrivateKey(): decrypting private key for public key "${publicKey}"`
      );

    return await PrivateKeyService.decrypt(
      password,
      account.encryptedPrivateKey,
      {
        ...(this.logger && {
          logger: this.logger,
        }),
      }
    );
  }

  /**
   * Gets a list of all the public keys.
   * @returns {string[]} a list of all the public keys. This returns an empty list if the private key storage has not
   * been initialized.
   */
  public async getPublicKeys(): Promise<string[]> {
    const isInitialized: boolean = await this.isInitialized();
    let accounts: IPksAccountStorageItem[];

    if (!isInitialized) {
      this.logger &&
        this.logger.debug(
          `${PrivateKeyService.name}#getPublicKeys(): private key service has not been initialized`
        );

      return [];
    }

    accounts = await this.getAccounts();

    return accounts.map((value) => value.publicKey);
  }

  /**
   * Simply checks if the private key store has been initialized. The definition of "initialized" is whether there is
   * an encrypted password tag present.
   * @returns {boolean} true if the private key store has been initialized, false otherwise.
   */
  public async isInitialized(): Promise<boolean> {
    const encryptedPasswordTag: string | null =
      await this.storageManager.getItem(this.passwordTagKeyName);

    return !!encryptedPasswordTag;
  }

  /**
   * Removes the password tag and all private keys from local storage.
   */
  public async reset(): Promise<void> {
    const items: Record<string, unknown> =
      await this.storageManager.getAllItems();
    const filteredKeyNames: string[] = Object.keys(items).filter((value) =>
      value.startsWith(this.accountPrefix)
    );

    return await this.storageManager.remove([
      ...filteredKeyNames,
      this.passwordTagKeyName, // remove the password tag
    ]);
  }

  /**
   * Sets an account into local storage, encrypted, using the password.
   * @param {ISetAccountOptions} data - options required to set the account.
   * @param {string} password - the password used to initialize the private key storage.
   * @throws {InvalidPasswordError} If the password is invalid.
   * @throws {EncryptionError} If there was a problem with the encryption.
   */
  public async setAccount(
    { name, privateKey, publicKey }: ISetAccountOptions,
    password: string
  ): Promise<void> {
    const isPasswordValid: boolean = await this.verifyPassword(password);
    let account: IPksAccountStorageItem | null;
    let encryptedPrivateKey: string;
    let passwordTag: IPksPasswordTagStorageItem | null;

    if (!isPasswordValid) {
      this.logger &&
        this.logger.debug(
          `${PrivateKeyService.name}#setAccount(): password is invalid`
        );

      throw new InvalidPasswordError();
    }

    this.logger &&
      this.logger.debug(
        `${PrivateKeyService.name}#setAccount(): encrypting private key for public key "${publicKey}"`
      );

    encryptedPrivateKey = await PrivateKeyService.encrypt(
      password,
      privateKey,
      {
        ...(this.logger && {
          logger: this.logger,
        }),
      }
    );
    account = await this.storageManager.getItem<IPksAccountStorageItem>(
      this.createAccountItemKey(publicKey)
    );
    passwordTag = await this.storageManager.getItem<IPksPasswordTagStorageItem>(
      this.passwordTagKeyName
    );

    if (!passwordTag) {
      this.logger &&
        this.logger.debug(
          `${PrivateKeyService.name}#setAccount(): failed to get password tag`
        );

      return;
    }

    this.logger &&
      this.logger.debug(
        `${PrivateKeyService.name}#setAccount(): storing private key for public key "${publicKey}"`
      );

    return await this.storageManager.setItems({
      [this.createAccountItemKey(publicKey)]: {
        ...(account
          ? {
              id: account.id,
              name: name || account.name,
            }
          : {
              id: uuid(),
              name: name || null,
            }),
        encryptedPrivateKey,
        passwordTagId: passwordTag.id,
        publicKey,
      },
    });
  }

  /**
   * Changes the current password to the new password. If the storage has not been initialized, a new password is set.
   *
   * NOTE: the new password will re-encrypt all private keys.
   * @param {string} newPassword - the new password.
   * @param {string} currentPassword - [optional] the current password.
   * @throws {InvalidPasswordError} if the private key storage has been initialized and the current password is invalid.
   */
  public async setPassword(
    newPassword: string,
    currentPassword?: string
  ): Promise<void> {
    const encryptedTag: string = await PrivateKeyService.encrypt(
      newPassword,
      this.passwordTag,
      {
        ...(this.logger && {
          logger: this.logger,
        }),
      }
    ); // encrypt the password tag (the extension id) with the new password
    const isInitialized: boolean = await this.isInitialized();
    const passwordTagItem: IPksPasswordTagStorageItem = {
      id: uuid(),
      encryptedTag,
      version: this.version,
    };
    let accounts: IPksAccountStorageItem[];
    let isPasswordValid: boolean;
    let newAccounts: IPksAccountStorageItem[];

    // if no password exists, we can just set the new one
    if (!isInitialized) {
      this.logger &&
        this.logger.debug(
          `${PrivateKeyService.name}#setPassword(): private key service has not been initialized, removing any previous accounts`
        );

      await this.reset(); // first remove any previously saved accounts

      this.logger &&
        this.logger.debug(
          `${PrivateKeyService.name}#setPassword(): saving new password tag to storage`
        );

      return await this.storageManager.setItems({
        [this.passwordTagKeyName]: passwordTagItem,
      });
    }

    // if we have a password tag stored and no password, throw an error
    if (!currentPassword) {
      this.logger &&
        this.logger.debug(
          `${PrivateKeyService.name}#setPassword(): private key service has been initialized but no password was supplied to validate`
        );

      throw new InvalidPasswordError();
    }

    isPasswordValid = await this.verifyPassword(currentPassword);

    if (!isPasswordValid) {
      this.logger &&
        this.logger.debug(
          `${PrivateKeyService.name}#setPassword(): private key service has been initialized but supplied password is invalid`
        );

      throw new InvalidPasswordError();
    }

    this.logger &&
      this.logger.debug(
        `${PrivateKeyService.name}#setPassword(): re-encrypting private keys`
      );

    accounts = await this.getAccounts();
    newAccounts = await Promise.all(
      // with a new password, we need to re-encrypt all the private keys
      accounts.map(async (value) => {
        const decryptedPrivateKey: string = await PrivateKeyService.decrypt(
          currentPassword,
          value.encryptedPrivateKey,
          {
            ...(this.logger && {
              logger: this.logger,
            }),
          }
        );
        const encryptedPrivateKey: string = await PrivateKeyService.encrypt(
          newPassword,
          decryptedPrivateKey,
          {
            ...(this.logger && {
              logger: this.logger,
            }),
          }
        );

        return {
          ...value,
          encryptedPrivateKey,
          passwordTagId: passwordTagItem.id,
        };
      })
    );

    this.logger &&
      this.logger.debug(
        `${PrivateKeyService.name}#setPassword(): saving new password tag and re-encrypted keys to storage`
      );

    // add the new password tag and the re-encrypted keys
    return await this.storageManager.setItems({
      [this.passwordTagKeyName]: passwordTagItem, // add the new password tag
      ...newAccounts.reduce(
        (acc, value) => ({
          ...acc,
          [this.createAccountItemKey(value.publicKey)]: value,
        }),
        {}
      ), // save the accounts to storage using an account and the public key as a prefix
    });
  }

  /**
   * Verifies if the supplied password is valid. This function fetches the encrypted password tag from storage and
   * decrypts it using the supplied password. If the decryption is successful, and the password tag matches, the
   * password is valid.
   * @param {string} password - the password to verify.
   * @returns {boolean} true if the password is valid, false otherwise.
   */
  public async verifyPassword(password: string): Promise<boolean> {
    const passwordTag: IPksPasswordTagStorageItem | null =
      await this.storageManager.getItem<IPksPasswordTagStorageItem>(
        this.passwordTagKeyName
      );
    let decryptedPasswordTag: string;

    // if we have the decrypted password tag, decrypt it and check it matches the extension id
    if (passwordTag) {
      this.logger &&
        this.logger.debug(
          `${PrivateKeyService.name}#verifyPassword(): password tag "${passwordTag.id}" found, attempting to validate`
        );

      try {
        decryptedPasswordTag = await PrivateKeyService.decrypt(
          passwordTag.encryptedTag,
          password,
          {
            ...(this.logger && {
              logger: this.logger,
            }),
          }
        );
      } catch (error) {
        this.logger &&
          this.logger.debug(
            `${PrivateKeyService.name}#verifyPassword(): failed to decrypt password tag "${passwordTag.id}"`
          );

        return false;
      }

      return decryptedPasswordTag === this.passwordTag;
    }

    return false;
  }
}
