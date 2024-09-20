import { decode as decodeHex, encode as encodeHex } from '@stablelib/hex';
import browser from 'webextension-polyfill';

// types
import type { TStorageItemTypes } from '@extension/types';

export default class BaseRepository {
  /**
   * public static functions
   */

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
   * protected functions
   */

  /**
   * Fetches the item by the given key.
   * @param {string} key - the key of the value to get.
   * @returns {TStorageItemTypes | null} the value of the item stored with the key, or null if no key/value exists.
   * @protected
   */
  public async _fetchByKey<ItemType = TStorageItemTypes>(
    key: string
  ): Promise<ItemType | null> {
    const item: Record<string, ItemType> = await browser.storage.local.get(key);

    return (item[key] as ItemType) || null;
  }

  /**
   * Fetches all items by a key prefix.
   * @param {string} keyPrefix - A key prefix.
   * @returns {TStorageItemTypes[]} The items that use the key prefix.
   * @protected
   */
  public async _fetchByPrefixKey<ItemType = TStorageItemTypes>(
    keyPrefix: string
  ): Promise<ItemType[]> {
    const allItems = await browser.storage.local.get();

    return Object.keys(allItems).reduce<ItemType[]>(
      (acc, key) =>
        key.startsWith(keyPrefix) ? [...acc, allItems[key] as ItemType] : acc,
      []
    );
  }

  /**
   * Removes an item or a set of items from storage by their key(s).
   * @param {string | string[]} keys - a key or multiple keys
   * @protected
   */
  protected async _removeByKeys(keys: string | string[]): Promise<void> {
    return await browser.storage.local.remove(keys);
  }

  /**
   * Removes an items from storage with the key prefix.
   * @param {string} keyPrefix - The key prefix.
   * @protected
   */
  protected async _removeByKeyPrefix(keyPrefix: string): Promise<void> {
    const allItems = await browser.storage.local.get();
    const keys = Object.keys(allItems).reduce<string[]>(
      (acc, key) => (key.startsWith(keyPrefix) ? [...acc, key] : acc),
      []
    );

    return await browser.storage.local.remove(keys);
  }

  /**
   * Saves items to storage.
   * @param {Record<string, TStorageItemTypes>} items The items to save.
   * @returns {TStorageItemTypes} the saved item.
   * @protected
   */
  protected async _save<ItemType = TStorageItemTypes>(
    items: Record<string, ItemType>
  ): Promise<Record<string, ItemType>> {
    await browser.storage.local.set(items);

    return items;
  }
}
