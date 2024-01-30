import { decode as decodeHex, encode as encodeHex } from '@stablelib/hex';
import { decode as decodeUtf8, encode as encodeUtf8 } from '@stablelib/utf8';
import { sign, SignKeyPair } from 'tweetnacl';
import { v4 as uuid } from 'uuid';

// constants
import {
  PASSWORD_TAG_ITEM_KEY,
  PRIVATE_KEY_ITEM_KEY_PREFIX,
} from '@extension/constants';

// errors
import { InvalidPasswordError, MalformedDataError } from '@extension/errors';

// services
import StorageManager from '../StorageManager';

// types
import type { ILogger } from '@common/types';
import type { IPasswordTag, IPrivateKey } from '@extension/types';
import type { ICreateOptions } from './types';

// utils
import decryptBytes from '@extension/utils/decryptBytes';
import encryptBytes from '@extension/utils/encryptBytes';

export default class PrivateKeyService {
  // private variables
  private readonly logger: ILogger | null;
  private readonly passwordTag: string;
  private readonly storageManager: StorageManager;

  // public variables
  public readonly version: number = 0;

  constructor({ logger, passwordTag, storageManager }: ICreateOptions) {
    this.logger = logger || null;
    this.passwordTag = passwordTag;
    this.storageManager = storageManager || new StorageManager();
  }

  /**
   * private functions
   */

  /**
   * Convenience function that simply creates the private key item key from a public key.
   * @param {Uint8Array} encodedPublicKey - the public key of the account encoded in hexadecimal.
   * @returns {string} the private key item key.
   */
  private createPrivateKeyItemKey(encodedPublicKey: string): string {
    return `${PRIVATE_KEY_ITEM_KEY_PREFIX}${encodedPublicKey}`;
  }

  /**
   * public functions
   */

  /**
   * Gets the decrypted private key from local storage for a given public key.
   * @param {Uint8Array} publicKey - the encoded public key of the private key.
   * @param {string} password - the password used to encrypt the private key.
   * @returns {Uint8Array | null} the decrypted private key, or null if no account is stored.
   * @throws {InvalidPasswordError} If the password is invalid.
   * @throws {DecryptionError} If there was a problem with the decryption.
   */
  public async getDecryptedPrivateKey(
    publicKey: Uint8Array,
    password: string
  ): Promise<Uint8Array | null> {
    const _functionName: string = 'getDecryptedPrivateKey';
    const isPasswordValid: boolean = await this.verifyPassword(password);
    let account: IPrivateKey | null;
    let encodedPublicKey: string;

    if (!isPasswordValid) {
      this.logger?.debug(
        `${PrivateKeyService.name}#${_functionName}(): password is invalid`
      );

      throw new InvalidPasswordError();
    }

    encodedPublicKey = encodeHex(publicKey);
    account = await this.storageManager.getItem<IPrivateKey>(
      this.createPrivateKeyItemKey(encodedPublicKey)
    );

    if (!account) {
      this.logger?.debug(
        `${PrivateKeyService.name}#${_functionName}(): no account stored for public key "${encodedPublicKey}"`
      );

      return null;
    }

    this.logger?.debug(
      `${PrivateKeyService.name}#${_functionName}(): decrypting private key for public key "${encodedPublicKey}"`
    );

    return await decryptBytes(
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
   * Gets a private key by its public key from storage.
   * @param {string} encodedPublicKey - the hexadecimal encoded public key.
   * @returns {Promise<IPrivateKey | null>} the private key or null.
   */
  public async getPrivateKeyByPublicKey(
    encodedPublicKey: string
  ): Promise<IPrivateKey | null> {
    return await this.storageManager.getItem(
      this.createPrivateKeyItemKey(encodedPublicKey)
    );
  }

  /**
   * Gets all the private keys from storage.
   * @returns {Promise<IPrivateKey[]>} all the private keys in local storage.
   */
  public async getPrivateKeys(): Promise<IPrivateKey[]> {
    const items: Record<string, unknown> =
      await this.storageManager.getAllItems();

    return Object.keys(items).reduce<IPrivateKey[]>(
      (acc, key) =>
        key.startsWith(PRIVATE_KEY_ITEM_KEY_PREFIX)
          ? [...acc, items[key] as IPrivateKey]
          : acc,
      []
    );
  }

  /**
   * Gets a list of all the public keys.
   * @returns {Uint8Array[]} a list of all the public keys. This returns an empty list if the private key storage has not
   * been initialized.
   */
  public async getPublicKeys(): Promise<Uint8Array[]> {
    const _functionName: string = 'getPublicKeys';
    const isInitialized: boolean = await this.isInitialized();
    let accounts: IPrivateKey[];

    if (!isInitialized) {
      this.logger?.debug(
        `${PrivateKeyService.name}#${_functionName}(): private key service has not been initialized`
      );

      return [];
    }

    accounts = await this.getPrivateKeys();

    return accounts.map((value) => decodeHex(value.publicKey));
  }

  /**
   * Simply checks if the private key store has been initialized. The definition of "initialized" is whether there is
   * an encrypted password tag present.
   * @returns {boolean} true if the private key store has been initialized, false otherwise.
   */
  public async isInitialized(): Promise<boolean> {
    const encryptedPasswordTag: string | null =
      await this.storageManager.getItem(PASSWORD_TAG_ITEM_KEY);

    return !!encryptedPasswordTag;
  }

  public async removePrivateKeyByPublicKey(
    encodedPublicKey: string
  ): Promise<void> {
    await this.storageManager.remove(
      this.createPrivateKeyItemKey(encodedPublicKey)
    );
  }

  /**
   * Removes the password tag and all private keys from local storage.
   */
  public async reset(): Promise<void> {
    const items: Record<string, unknown> =
      await this.storageManager.getAllItems();
    const filteredKeyNames: string[] = Object.keys(items).filter((value) =>
      value.startsWith(PRIVATE_KEY_ITEM_KEY_PREFIX)
    );

    return await this.storageManager.remove([
      ...filteredKeyNames,
      PASSWORD_TAG_ITEM_KEY, // remove the password tag
    ]);
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
  ): Promise<IPasswordTag> {
    const _functionName: string = 'setPassword';
    const encryptedTag: Uint8Array = await encryptBytes(
      encodeUtf8(this.passwordTag),
      newPassword,
      {
        ...(this.logger && {
          logger: this.logger,
        }),
      }
    ); // encrypt the password tag (the extension id) with the new password
    const isInitialized: boolean = await this.isInitialized();
    const passwordTagItem: IPasswordTag = {
      id: uuid(),
      encryptedTag: encodeHex(encryptedTag), // encode it into hexadecimal
      version: this.version,
    };
    let privateKeys: IPrivateKey[];
    let isPasswordValid: boolean;

    // if no password exists, we can just set the new one
    if (!isInitialized) {
      this.logger?.debug(
        `${PrivateKeyService.name}#${_functionName}(): private key service has not been initialized, removing any previous accounts`
      );

      await this.reset(); // first remove any previously saved accounts

      this.logger?.debug(
        `${PrivateKeyService.name}#${_functionName}(): saving new password tag to storage`
      );

      await this.storageManager.setItems({
        [PASSWORD_TAG_ITEM_KEY]: passwordTagItem,
      });

      return passwordTagItem;
    }

    // if we have a password tag stored and no password, throw an error
    if (!currentPassword) {
      this.logger?.debug(
        `${PrivateKeyService.name}#${_functionName}(): private key service has been initialized but no password was supplied to validate`
      );

      throw new InvalidPasswordError();
    }

    isPasswordValid = await this.verifyPassword(currentPassword);

    if (!isPasswordValid) {
      this.logger?.debug(
        `${PrivateKeyService.name}#${_functionName}(): private key service has been initialized but supplied password is invalid`
      );

      throw new InvalidPasswordError();
    }

    this.logger?.debug(
      `${PrivateKeyService.name}#${_functionName}(): re-encrypting private keys`
    );

    privateKeys = await this.getPrivateKeys();
    privateKeys = await Promise.all(
      // with a new password, we need to re-encrypt all the private keys
      privateKeys.map<Promise<IPrivateKey>>(async (value) => {
        const decryptedPrivateKey: Uint8Array = await decryptBytes(
          decodeHex(value.encryptedPrivateKey), // private keys are encoded in hexadecimal
          currentPassword,
          {
            ...(this.logger && {
              logger: this.logger,
            }),
          }
        );
        const encryptedPrivateKey: Uint8Array = await encryptBytes(
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

    this.logger?.debug(
      `${PrivateKeyService.name}#${_functionName}(): saving new password tag and re-encrypted keys to storage`
    );

    // add the new password tag and the re-encrypted keys
    await this.storageManager.setItems({
      [PASSWORD_TAG_ITEM_KEY]: passwordTagItem, // add the new password tag
      ...privateKeys.reduce(
        (acc, value) => ({
          ...acc,
          [this.createPrivateKeyItemKey(value.publicKey)]: value,
        }),
        {}
      ), // save the accounts to storage using the public key as a prefix
    });

    return passwordTagItem;
  }

  /**
   * Sets a private key into local storage, encrypted, using the password. If the private key is not known in storage,
   * it will be created, otherwise it will be updated.
   * @param {Uint8Array} privateKey - the private key to encrypt.
   * @param {string} password - the password used to initialize the private key storage.
   * @returns {IPrivateKey | null} the initialized private key item.
   * @throws {InvalidPasswordError} If the password is invalid.
   * @throws {MalformedDataError} If there the private key is the incorrect format (should have been created using
   * {@link http://ed25519.cr.yp.to/ ed25519}).
   * @throws {EncryptionError} If there was a problem with the encryption or the private key is invalid.
   */
  public async setPrivateKey(
    privateKey: Uint8Array,
    password: string
  ): Promise<IPrivateKey | null> {
    const _functionName: string = 'setPrivateKey';
    const isPasswordValid: boolean = await this.verifyPassword(password);
    let encodedPublicKey: string;
    let encryptedPrivateKey: Uint8Array;
    let keyPair: SignKeyPair;
    let now: Date;
    let passwordTag: IPasswordTag | null;
    let privateKeyItem: IPrivateKey | null;
    let privateKeyItemKey: string;

    if (!isPasswordValid) {
      this.logger?.debug(
        `${PrivateKeyService.name}#${_functionName}(): password is invalid`
      );

      throw new InvalidPasswordError();
    }

    try {
      keyPair = sign.keyPair.fromSecretKey(privateKey);
    } catch (error) {
      this.logger?.debug(
        `${PrivateKeyService.name}#${_functionName}(): ${error.message}`
      );

      throw new MalformedDataError(error.message);
    }

    encodedPublicKey = encodeHex(keyPair.publicKey);

    this.logger?.debug(
      `${PrivateKeyService.name}#${_functionName}(): encrypting private key for public key "${encodedPublicKey}"`
    );

    encryptedPrivateKey = await encryptBytes(privateKey, password, {
      ...(this.logger && {
        logger: this.logger,
      }),
    });
    privateKeyItemKey = this.createPrivateKeyItemKey(encodedPublicKey);
    privateKeyItem = await this.storageManager.getItem<IPrivateKey>(
      privateKeyItemKey
    );
    passwordTag = await this.storageManager.getItem<IPasswordTag>(
      PASSWORD_TAG_ITEM_KEY
    );

    if (!passwordTag) {
      this.logger?.debug(
        `${PrivateKeyService.name}#${_functionName}(): failed to get password tag`
      );

      return null;
    }

    this.logger?.debug(
      `${PrivateKeyService.name}#${_functionName}(): storing private key for public key "${encodedPublicKey}"`
    );

    now = new Date();

    privateKeyItem = {
      // if the private key item exists, we want to update it
      ...(privateKeyItem
        ? {
            createdAt: privateKeyItem.createdAt,
            id: privateKeyItem.id,
          }
        : {
            createdAt: now.getTime(),
            id: uuid(),
          }),
      encryptedPrivateKey: encodeHex(encryptedPrivateKey),
      passwordTagId: passwordTag.id,
      publicKey: encodedPublicKey,
      updatedAt: now.getTime(),
    };

    await this.storageManager.setItems({
      [privateKeyItemKey]: privateKeyItem,
    });

    return privateKeyItem;
  }

  /**
   * Verifies if the supplied password is valid. This function fetches the encrypted password tag from storage and
   * decrypts it using the supplied password. If the decryption is successful, and the password tag matches, the
   * password is valid.
   * @param {string} password - the password to verify.
   * @returns {boolean} true if the password is valid, false otherwise.
   */
  public async verifyPassword(password: string): Promise<boolean> {
    const _functionName: string = 'verifyPassword';
    const passwordTag: IPasswordTag | null =
      await this.storageManager.getItem<IPasswordTag>(PASSWORD_TAG_ITEM_KEY);
    let decryptedPasswordTag: Uint8Array;

    // if we have the decrypted password tag, decrypt it and check it matches the extension id
    if (passwordTag) {
      this.logger?.debug(
        `${PrivateKeyService.name}#${_functionName}(): password tag "${passwordTag.id}" found, attempting to validate`
      );

      try {
        decryptedPasswordTag = await decryptBytes(
          decodeHex(passwordTag.encryptedTag),
          password,
          {
            ...(this.logger && {
              logger: this.logger,
            }),
          }
        );
      } catch (error) {
        this.logger?.debug(
          `${PrivateKeyService.name}#${_functionName}(): failed to decrypt password tag "${passwordTag.id}"`
        );

        return false;
      }

      return decodeUtf8(decryptedPasswordTag) === this.passwordTag;
    }

    return false;
  }
}
