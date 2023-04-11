import browser from 'webextension-polyfill';

// Types
import { IStorageItemTypes } from '@extension/types';

export default class StorageManager {
  /**
   * Public functions
   */

  public async getAllItems(): Promise<
    Record<string, IStorageItemTypes | unknown>
  > {
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

  public async remove(keys: string | string[]): Promise<void> {
    return await browser.storage.local.remove(keys);
  }

  public async setItems(
    items: Record<string, IStorageItemTypes>
  ): Promise<void> {
    return await browser.storage.local.set(items);
  }
}
