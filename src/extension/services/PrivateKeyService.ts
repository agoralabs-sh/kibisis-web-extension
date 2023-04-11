import { decode as decodeHex, encode as encodeHex } from '@stablelib/hex';
import { decode as decodeUtf8, encode as encodeUtf8 } from '@stablelib/utf8';
import scrypt from 'scrypt-async';
import { hash, randomBytes, secretbox } from 'tweetnacl';
import { v4 as uuid } from 'uuid';

// Constants
import {
  PKS_ACCOUNT_KEY_PREFIX,
  PKS_PASSWORD_TAG_KEY,
} from '@extension/constants';

// Errors
import {
  DecryptionError,
  EncryptionError,
  InvalidPasswordError,
} from '@extension/errors';

// Services
import StorageManager from './StorageManager';

// Types
import { IBaseOptions, ILogger } from '@common/types';
import {
  IPksAccountStorageItem,
  IPksPasswordTagStorageItem,
  ISetAccountOptions,
} from '@extension/types';

interface INewOptions extends IBaseOptions {
  storageManager?: StorageManager;
  passwordTag: string;
}

export default class PrivateKeyService {
  // private static variables
  private static readonly saltByteSize: number = 64;

  // private variables
  private readonly logger: ILogger | null;
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
  ): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve) => {
      const passwordHash: Uint8Array = hash(encodeUtf8(password));

      scrypt(
        passwordHash,
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
   * Public static functions
   */

  /**
   * Decrypts some data using the supplied password.
   * @param {Uint8Array} data - the IV + salt + encrypted data as bytes.
   * @param {string} password - the password used to decrypt the data.
   * @param {IBaseOptions} options - options such as the logger.
   * @returns {Promise<Uint8Array>} the decrypted data.
   * @throws {DecryptionError} If the encrypted data is malformed, or the password is invalid.
   * @static
   */
  public static async decrypt(
    data: Uint8Array,
    password: string,
    { logger }: IBaseOptions
  ): Promise<Uint8Array> {
    const [nonce, salt, encryptedData] = [
      data.slice(0, secretbox.nonceLength),
      data.slice(
        secretbox.nonceLength,
        secretbox.nonceLength + this.saltByteSize
      ),
      data.slice(secretbox.nonceLength + this.saltByteSize),
    ];
    let derivedKey: Uint8Array;
    let decryptedData: Uint8Array | null;
    let errorMessage: string;

    if (!nonce || nonce.byteLength !== secretbox.nonceLength) {
      throw new DecryptionError('invalid nonce');
    }

    if (!salt || salt.byteLength !== this.saltByteSize) {
      throw new DecryptionError('invalid salt');
    }

    derivedKey = await this.createDerivedKeyFromPassword(password, salt);
    decryptedData = secretbox.open(encryptedData, nonce, derivedKey);

    if (!decryptedData) {
      errorMessage = 'failed to decrypt key';

      logger &&
        logger.debug(`${PrivateKeyService.name}#decrypt(): ${errorMessage}`);

      throw new DecryptionError(errorMessage);
    }

    return decryptedData;
  }

  /**
   * Encrypts some data using the supplied password.
   * @param {Uint8Array} data - the data to encrypt.
   * @param {string} password - the password used to encrypt the data.
   * @param {IBaseOptions} options - options such as the logger.
   * @returns {Promise<Uint8Array>} the data encrypted with the password.
   * @throws {EncryptionError} If the data to be encrypted exceeds 2^39−256 bytes.
   * @static
   */
  public static async encrypt(
    data: Uint8Array,
    password: string,
    { logger }: IBaseOptions
  ): Promise<Uint8Array> {
    const salt: Uint8Array = PrivateKeyService.generateRandomBytes(
      PrivateKeyService.saltByteSize
    );
    const derivedKey: Uint8Array =
      await PrivateKeyService.createDerivedKeyFromPassword(password, salt);
    const nonce: Uint8Array = PrivateKeyService.generateRandomBytes(
      secretbox.nonceLength
    );
    let encryptedData: Uint8Array;
    let buffer: Uint8Array;

    try {
      encryptedData = secretbox(data, nonce, derivedKey);
    } catch (error) {
      logger &&
        logger.error(`${PrivateKeyService.name}#encrypt(): ${error.message}`);

      throw new EncryptionError(error.message);
    }

    buffer = new Uint8Array(nonce.length + salt.length + encryptedData.length);

    buffer.set(nonce, 0);
    buffer.set(salt, nonce.length);
    buffer.set(new Uint8Array(encryptedData), nonce.length + salt.length);

    return buffer;
  }

  /**
   * Convenience function that generates a random amount of bytes.
   * @param {number} size - [optional] the number of random bytes to generate. Defaults to 32.
   * @returns {Uint8Array} random bytes defined by the size.
   * @static
   */
  public static generateRandomBytes(size: number = 32): Uint8Array {
    return randomBytes(size);
  }

  /**
   * Private functions
   */

  /**
   * Convenience function that simply creates the account item key from a public key.
   * @param {Uint8Array} encodedPublicKey - the public key of the account encoded in hexadecimal.
   * @returns {string} the account item key.
   */
  public createAccountItemKey(encodedPublicKey: string): string {
    return `${PKS_ACCOUNT_KEY_PREFIX}${encodedPublicKey}`;
  }

  /**
   * Public functions
   */

  /**
   * Gets all the accounts from storage.
   * @returns {Promise<IPksAccountStorageItem[]>} all the accounts in local storage.
   * @private
   */
  public async getAccounts(): Promise<IPksAccountStorageItem[]> {
    const items: Record<string, unknown> =
      await this.storageManager.getAllItems();

    return Object.keys(items).reduce<IPksAccountStorageItem[]>(
      (acc, key) =>
        key.startsWith(PKS_ACCOUNT_KEY_PREFIX)
          ? [...acc, items[key] as IPksAccountStorageItem]
          : acc,
      []
    );
  }

  /**
   * Gets the decrypted private key from local storage for a given public key.
   * @param {Uint8Array} publicKey - the encoded public key of the private key.
   * @param {string} password - the password used to encrypt the private key.
   * @returns {Uint8Array | null} the decrypted private key, or null if no account is stored.
   * @throws {InvalidPasswordError} If the password is invalid.
   * @throws {DecryptionError} If there was a problem with the decryption.
   */
  public async getPrivateKey(
    publicKey: Uint8Array,
    password: string
  ): Promise<Uint8Array | null> {
    const isPasswordValid: boolean = await this.verifyPassword(password);
    let account: IPksAccountStorageItem | null;
    let encodedPublicKey: string;

    if (!isPasswordValid) {
      this.logger &&
        this.logger.debug(
          `${PrivateKeyService.name}#getPrivateKey(): password is invalid`
        );

      throw new InvalidPasswordError();
    }

    encodedPublicKey = encodeHex(publicKey);
    account = await this.storageManager.getItem<IPksAccountStorageItem>(
      this.createAccountItemKey(encodedPublicKey)
    );

    if (!account) {
      this.logger &&
        this.logger.debug(
          `${PrivateKeyService.name}#getPrivateKey(): no account stored for public key "${encodedPublicKey}"`
        );

      return null;
    }

    this.logger &&
      this.logger.debug(
        `${PrivateKeyService.name}#getPrivateKey(): decrypting private key for public key "${encodedPublicKey}"`
      );

    return await PrivateKeyService.decrypt(
      decodeHex(account.encryptedPrivateKey),
      password,
      {
        ...(this.logger && {
          logger: this.logger,
        }),
      }
    );
  }

  /**
   * Gets a list of all the public keys.
   * @returns {Uint8Array[]} a list of all the public keys. This returns an empty list if the private key storage has not
   * been initialized.
   */
  public async getPublicKeys(): Promise<Uint8Array[]> {
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

    return accounts.map((value) => decodeHex(value.publicKey));
  }

  /**
   * Simply checks if the private key store has been initialized. The definition of "initialized" is whether there is
   * an encrypted password tag present.
   * @returns {boolean} true if the private key store has been initialized, false otherwise.
   */
  public async isInitialized(): Promise<boolean> {
    const encryptedPasswordTag: string | null =
      await this.storageManager.getItem(PKS_PASSWORD_TAG_KEY);

    return !!encryptedPasswordTag;
  }

  /**
   * Removes the password tag and all private keys from local storage.
   */
  public async reset(): Promise<void> {
    const items: Record<string, unknown> =
      await this.storageManager.getAllItems();
    const filteredKeyNames: string[] = Object.keys(items).filter((value) =>
      value.startsWith(PKS_ACCOUNT_KEY_PREFIX)
    );

    return await this.storageManager.remove([
      ...filteredKeyNames,
      PKS_PASSWORD_TAG_KEY, // remove the password tag
    ]);
  }

  /**
   * Sets an account into local storage, encrypted, using the password.
   * @param {ISetAccountOptions} options - options required to set the account.
   * @param {string} password - the password used to initialize the private key storage.
   * @returns {IPksAccountStorageItem | null} the initialized PKS account item.
   * @throws {InvalidPasswordError} If the password is invalid.
   * @throws {EncryptionError} If there was a problem with the encryption.
   */
  public async setAccount(
    { name, privateKey, publicKey }: ISetAccountOptions,
    password: string
  ): Promise<IPksAccountStorageItem | null> {
    const isPasswordValid: boolean = await this.verifyPassword(password);
    let account: IPksAccountStorageItem | null;
    let accountItemKey: string;
    let encodedPublicKey: string;
    let encryptedPrivateKey: Uint8Array;
    let now: Date;
    let passwordTag: IPksPasswordTagStorageItem | null;

    if (!isPasswordValid) {
      this.logger &&
        this.logger.debug(
          `${PrivateKeyService.name}#setAccount(): password is invalid`
        );

      throw new InvalidPasswordError();
    }

    encodedPublicKey = encodeHex(publicKey);

    this.logger &&
      this.logger.debug(
        `${PrivateKeyService.name}#setAccount(): encrypting private key for public key "${encodedPublicKey}"`
      );

    encryptedPrivateKey = await PrivateKeyService.encrypt(
      privateKey,
      password,
      {
        ...(this.logger && {
          logger: this.logger,
        }),
      }
    );
    accountItemKey = this.createAccountItemKey(encodedPublicKey);
    account = await this.storageManager.getItem<IPksAccountStorageItem>(
      accountItemKey
    );
    passwordTag = await this.storageManager.getItem<IPksPasswordTagStorageItem>(
      PKS_PASSWORD_TAG_KEY
    );

    if (!passwordTag) {
      this.logger &&
        this.logger.debug(
          `${PrivateKeyService.name}#setAccount(): failed to get password tag`
        );

      return null;
    }

    this.logger &&
      this.logger.debug(
        `${PrivateKeyService.name}#setAccount(): storing private key for public key "${publicKey}"`
      );

    now = new Date();

    account = {
      ...(account
        ? {
            createdAt: account.createdAt,
            id: account.id,
            name: name || account.name,
          }
        : {
            createdAt: now.getTime(),
            id: uuid(),
            name: name || null,
          }),
      encryptedPrivateKey: encodeHex(encryptedPrivateKey),
      passwordTagId: passwordTag.id,
      publicKey: encodedPublicKey,
      updatedAt: now.getTime(),
    };

    await this.storageManager.setItems({
      [accountItemKey]: account,
    });

    return account;
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
    const encryptedTag: Uint8Array = await PrivateKeyService.encrypt(
      encodeUtf8(this.passwordTag),
      newPassword,
      {
        ...(this.logger && {
          logger: this.logger,
        }),
      }
    ); // encrypt the password tag (the extension id) with the new password
    const isInitialized: boolean = await this.isInitialized();
    const passwordTagItem: IPksPasswordTagStorageItem = {
      id: uuid(),
      encryptedTag: encodeHex(encryptedTag), // encode it into hexadecimal
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
        [PKS_PASSWORD_TAG_KEY]: passwordTagItem,
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
        const decryptedPrivateKey: Uint8Array = await PrivateKeyService.decrypt(
          decodeHex(value.encryptedPrivateKey), // private keys are encoded in hexadecimal
          currentPassword,
          {
            ...(this.logger && {
              logger: this.logger,
            }),
          }
        );
        const encryptedPrivateKey: Uint8Array = await PrivateKeyService.encrypt(
          decryptedPrivateKey,
          newPassword,
          {
            ...(this.logger && {
              logger: this.logger,
            }),
          }
        );

        return {
          ...value,
          encryptedPrivateKey: encodeHex(encryptedPrivateKey),
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
      [PKS_PASSWORD_TAG_KEY]: passwordTagItem, // add the new password tag
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
        PKS_PASSWORD_TAG_KEY
      );
    let decryptedPasswordTag: Uint8Array;

    // if we have the decrypted password tag, decrypt it and check it matches the extension id
    if (passwordTag) {
      this.logger &&
        this.logger.debug(
          `${PrivateKeyService.name}#verifyPassword(): password tag "${passwordTag.id}" found, attempting to validate`
        );

      try {
        decryptedPasswordTag = await PrivateKeyService.decrypt(
          decodeHex(passwordTag.encryptedTag),
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

      return decodeUtf8(decryptedPasswordTag) === this.passwordTag;
    }

    return false;
  }
}
