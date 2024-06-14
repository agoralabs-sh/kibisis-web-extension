import browser from 'webextension-polyfill';

// types
import type { IStorageItemTypes } from '@extension/types';

export default class StorageManager {
  /**
   * Public functions
   */

  public async getAllItems(): Promise<Record<string, IStorageItemTypes>> {
    return await browser.storage.local.get();
  }

  /**
   * Convenience function that just gets the value stored in storage for a given key.
   * @param {string} key - the key of the value to get.
   * @returns {T | null} the value of the item stored with the key, or null if no key/value exists.
   */
  public async getItem<T = IStorageItemTypes>(key: string): Promise<T | null> {
    const item: Record<string, T> = await browser.storage.local.get(key);

    return (item[key] as T) || null;
  }

  /**
   * Removes all storage items.
   */
  public async removeAll(): Promise<void> {
    const storageItems: Record<string, IStorageItemTypes | unknown> =
      await this.getAllItems();

    return await browser.storage.local.remove(Object.keys(storageItems));
  }

  /**
   * Removes an item or a set of items from storage.
   * @param {string | string[]} keys - a key or multiple keys
   */
  public async remove(keys: string | string[]): Promise<void> {
    return await browser.storage.local.remove(keys);
  }

  public async setItems(
    items: Record<string, IStorageItemTypes>
  ): Promise<void> {
    return await browser.storage.local.set(items);
  }
}
