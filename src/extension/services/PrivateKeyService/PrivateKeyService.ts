import { decode as decodeHex, encode as encodeHex } from '@stablelib/hex';
import { sign } from 'tweetnacl';
import { v4 as uuid } from 'uuid';

// constants
import { PRIVATE_KEY_ITEM_KEY_PREFIX } from '@extension/constants';

// services
import StorageManager from '../StorageManager';

// types
import type { IPrivateKey } from '@extension/types';
import type { ICreatePrivateKeyOptions, INewOptions } from './types';
import { EncryptionMethodEnum } from '@extension/enums';

//

/**
 * Handles all interactions with the private key item in storage. This does not deal with any encryption/decryption,
 * this is handled in the PasswordService and the PasskeyService.
 *
 * @version 0:
 * * The `encryptedPrivateKey` property is the "secret key" - the private key concentrated to the public key,
 * @version 1:
 * * The `encryptedPrivateKey` property is replaced with the actual private key (seed) rather than the "secret key"
 * (private key concentrated to the public key).
 * * `passwordTagId` has been replaced with `encryptionID` and `encryptionMethod`
 * @version 2:
 * * The new `privateKey` property is the unencrypted private key that is non-nullified when the password lock feature is
 * enabled and not timed out.
 */
export default class PrivateKeyService {
  // public static variables
  public static readonly latestVersion: number = 2;

  // private variables
  private readonly storageManager: StorageManager;

  constructor(options?: INewOptions) {
    this.storageManager = options?.storageManager || new StorageManager();
  }

  /**
   * public static functions
   */

  /**
   * Convenience function that creates a new private key item.
   * @param {ICreatePrivateKeyOptions} options - the raw encrypted private key, the raw public key and the encryption
   * method & ID.
   * @returns {IPrivateKey} an initialized private key item.
   * @public
   * @static
   */
  public static createPrivateKey({
    encryptedPrivateKey,
    encryptionID,
    encryptionMethod,
    privateKey,
    publicKey,
  }: ICreatePrivateKeyOptions): IPrivateKey {
    const now = new Date();

    return {
      createdAt: now.getTime(),
      encryptedPrivateKey: PrivateKeyService.encode(encryptedPrivateKey),
      encryptionID,
      encryptionMethod,
      id: uuid(),
      privateKey: privateKey || null,
      publicKey: PrivateKeyService.encode(publicKey),
      updatedAt: now.getTime(),
      version: PrivateKeyService.latestVersion,
    };
  }

  /**
   * Convenience that decodes a public/private key from hexadecimal.
   * @param {string} encodedKey - the hexadecimal encoded key to decode.
   * @returns {Uint8Array} the decoded key.
   * @public
   * @static
   */
  public static decode(encodedKey: string): Uint8Array {
    return decodeHex(encodedKey);
  }

  /**
   * Convenience that encodes a public/private key to uppercase hexadecimal.
   * @param {Uint8Array} key - the key to encode.
   * @returns {string} the key encoded to uppercase hexadecimal.
   * @public
   * @static
   */
  public static encode(key: Uint8Array): string {
    return encodeHex(key);
  }

  /**
   * Convenience function that extracts the private key (seed) from a "secret key". The secret key is used by tweetnacl
   * and is defined as the 32-byte private key (seed) concatenated to the 32 byte public key.
   * @param {Uint8Array} secretKey - a 64 byte "secret key".
   * @returns {Uint8Array} a 32 byte private key (seed).
   * @public
   * @static
   */
  public static extractPrivateKeyFromSecretKey(
    secretKey: Uint8Array
  ): Uint8Array {
    // if the secret key is <=32-bytes, it is probably not a secret key.
    if (secretKey.byteLength <= sign.seedLength) {
      return secretKey;
    }

    return secretKey.slice(0, sign.seedLength); // get the first 32 bytes, this is the private key (seed)
  }

  /**
   * private functions
   */

  /**
   * Convenience function that simply creates the private key item key from a public key.
   * @param {Uint8Array} publicKey - a hexadecimal encoded public key string.
   * @returns {string} the private key item key.
   * @public
   */
  private _createPrivateKeyItemKey(publicKey: string): string {
    return `${PRIVATE_KEY_ITEM_KEY_PREFIX}${publicKey}`;
  }

  /**
   * Sanitizes the private key item, only returning properties that are in the private key item. This function acts as
   * a way to "upgrade" the private keys to handle the changes between versions.
   * @param {IPrivateKey} item - the private key item to sanitize.
   * @returns {IPrivateKey} the sanitized private key item.
   * @private
   */
  private _sanitize({
    createdAt,
    encryptedPrivateKey,
    encryptionID,
    id,
    passwordTagId,
    privateKey,
    publicKey,
    encryptionMethod,
    updatedAt,
    version,
  }: IPrivateKey): IPrivateKey {
    const _version = !version ? 0 : version; // if there is no version, start at zero (legacy)
    const _privateKey = !privateKey ? null : privateKey; // if there is no unencrypted private key (version <2) use null
    let _encryptionID = encryptionID;
    let _encryptionMethod = encryptionMethod;

    // if there is a password tag id, this means it is using the old style, replace it with the new properties (v1+)
    if (
      passwordTagId &&
      (!encryptionID || encryptionMethod !== EncryptionMethodEnum.Passkey)
    ) {
      _encryptionID = passwordTagId;
      _encryptionMethod = EncryptionMethodEnum.Password;
    }

    return {
      createdAt,
      id,
      encryptedPrivateKey,
      encryptionID: _encryptionID,
      encryptionMethod: _encryptionMethod,
      privateKey: _privateKey,
      publicKey,
      updatedAt,
      version: _version,
    };
  }

  /**
   * public functions
   */

  /**
   * Gets all the private keys from storage.
   * @returns {Promise<IPrivateKey[]>} a promise that resolves to all the private keys in storage.
   * @public
   */
  public async fetchAllFromStorage(): Promise<IPrivateKey[]> {
    const items = await this.storageManager.getAllItems();

    return Object.keys(items).reduce<IPrivateKey[]>(
      (acc, key) =>
        key.startsWith(PRIVATE_KEY_ITEM_KEY_PREFIX)
          ? [...acc, this._sanitize(items[key] as IPrivateKey)]
          : acc,
      []
    );
  }

  /**
   * Gets a private key by its public key from storage.
   * @param {Uint8Array | string} publicKey - the raw or hexadecimal encoded public key.
   * @returns {Promise<IPrivateKey | null>} a promise that resolves to the private key or null.
   * @public
   */
  public async fetchFromStorageByPublicKey(
    publicKey: Uint8Array | string
  ): Promise<IPrivateKey | null> {
    const _publicKey =
      typeof publicKey !== 'string'
        ? PrivateKeyService.encode(publicKey)
        : publicKey;
    const item = await this.storageManager.getItem<IPrivateKey>(
      this._createPrivateKeyItemKey(_publicKey.toUpperCase())
    );

    return item ? this._sanitize(item) : null;
  }

  /**
   * Gets a list of all the public keys. All returned keys will be hexadecimal encoded strings.
   * @returns {Promise<string[]} a promise that resolves to a list of all the public keys.
   * @public
   */
  public async listPublicKeys(): Promise<string[]> {
    const items = await this.fetchAllFromStorage();

    return items.map((value) => value.publicKey);
  }

  /**
   * Removes a private key from storage by its public key.
   * @param {Uint8Array | string} publicKey - a raw or hexadecimal encoded public key.
   * @public
   */
  public async removeFromStorageByPublicKey(
    publicKey: Uint8Array | string
  ): Promise<void> {
    const _publicKey =
      typeof publicKey !== 'string'
        ? PrivateKeyService.encode(publicKey)
        : publicKey;

    await this.storageManager.remove(
      this._createPrivateKeyItemKey(_publicKey.toUpperCase())
    );
  }

  /**
   * Removes all private keys from storage.
   * @public
   */
  public async removeAllFromStorage(): Promise<void> {
    const keys = await this.listPublicKeys();

    return await this.storageManager.remove(keys);
  }

  /**
   * Saves an array of private keys item to storage. This will overwrite any matching private key items by their public
   * key.
   * @param {IPrivateKey[]} items - the private key items to save.
   * @returns {Promise<IPrivateKey[]>} a promise that resolves to the saved private keys.
   * @public
   */
  public async saveManyToStorage(items: IPrivateKey[]): Promise<IPrivateKey[]> {
    const _items = items.map((value) => this._sanitize(value));

    await this.storageManager.setItems(
      _items.reduce<Record<string, IPrivateKey>>(
        (acc, currentValue) => ({
          ...acc,
          [this._createPrivateKeyItemKey(currentValue.publicKey)]: currentValue,
        }),
        {}
      )
    );

    return _items;
  }

  /**
   * Saves a single private key item to storage. This will overwrite a matching private key item by its public key.
   * @param {IPrivateKey} item - the private key item to save.
   * @returns {Promise<IPrivateKey>} a promise that resolves to the saved private key.
   * @public
   */
  public async saveToStorage(item: IPrivateKey): Promise<IPrivateKey> {
    const _item = this._sanitize(item);

    await this.storageManager.setItems({
      [this._createPrivateKeyItemKey(_item.publicKey)]: _item,
    });

    return _item;
  }
}
