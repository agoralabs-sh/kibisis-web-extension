import { decode as decodeHex, encode as encodeHex } from '@stablelib/hex';
import { sign, SignKeyPair } from 'tweetnacl';
import { v4 as uuid } from 'uuid';

// constants
import { PRIVATE_KEY_ITEM_KEY_PREFIX } from '@extension/constants';

// errors
import { MalformedDataError } from '@extension/errors';

// services
import StorageManager from '../StorageManager';

// types
import type { ILogger } from '@common/types';
import type { IPrivateKey } from '@extension/types';
import type { ICreatePrivateKeyOptions, INewOptions } from './types';

export default class PrivateKeyService {
  // private variables
  private readonly logger: ILogger | null;
  private readonly passwordTag: string;
  private readonly storageManager: StorageManager;

  // public variables
  public readonly version: number = 0;

  constructor(options?: INewOptions) {
    this.logger = options?.logger || null;
    this.storageManager = options?.storageManager || new StorageManager();
  }

  /**
   * public static functions
   */

  /**
   * Convenience function that creates a new private key item.
   * @param {ICreatePrivateKeyOptions} options - the raw encrypted private key, the raw public key and the password tag
   * used to encrypt the private key.
   * @returns {IPrivateKey} an initialized private key item.
   * @public
   * @static
   */
  public static createPrivateKey({
    encryptedPrivateKey,
    passwordTagId,
    publicKey,
  }: ICreatePrivateKeyOptions): IPrivateKey {
    const now = new Date();

    return {
      createdAt: now.getTime(),
      encryptedPrivateKey: PrivateKeyService.encode(encryptedPrivateKey),
      id: uuid(),
      passwordTagId,
      publicKey: PrivateKeyService.encode(publicKey),
      updatedAt: now.getTime(),
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
   * Convenience that extracts the raw public key from a private key.
   * @param {Uint8Array} privateKey - the raw private key.
   * @returns {Uint8Array} the public key for the supplied private key.
   * @throws {MalformedDataError} if the private key is the incorrect format (should have been created using
   * {@link http://ed25519.cr.yp.to/ ed25519}).
   * @public
   * @static
   */
  public static extractPublicKeyFromPrivateKey(
    privateKey: Uint8Array
  ): Uint8Array {
    let keyPair: SignKeyPair;

    try {
      keyPair = sign.keyPair.fromSecretKey(privateKey);

      return keyPair.publicKey;
    } catch (error) {
      throw new MalformedDataError(error.message);
    }
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
   * Sanitizes the private key item, only returning properties that are in the private key item.
   * @param {IPrivateKey} item - the private key item to sanitize.
   * @returns {IPrivateKey} the sanitized private key item.
   * @private
   */
  private _sanitize(item: IPrivateKey): IPrivateKey {
    return {
      createdAt: item.createdAt,
      id: item.id,
      encryptedPrivateKey: item.encryptedPrivateKey,
      passwordTagId: item.passwordTagId,
      publicKey: item.publicKey,
      updatedAt: item.updatedAt,
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
          ? [...acc, items[key] as IPrivateKey]
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

    return await this.storageManager.getItem(
      this._createPrivateKeyItemKey(_publicKey.toUpperCase())
    );
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
