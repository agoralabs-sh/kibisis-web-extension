// constants
import { NEWS_KEY } from '@extension/constants';

// services
import StorageManager from '../StorageManager';

// types
import type { INewsItem } from './types';

export default class NewsService {
  // private variables
  private readonly storageManager: StorageManager;

  constructor() {
    this.storageManager = new StorageManager();
  }

  /**
   * public static functions
   */

  public static initializeDefaultNewsItem(name: string): INewsItem {
    return {
      name,
      read: false,
    };
  }

  /**
   * public functions
   */

  /**
   * Gets all the news items.
   * @returns {Promise<INewsItem[]>} a promise that resolves to all the news items.
   * exist.
   */
  public async getAll(): Promise<INewsItem[]> {
    return (await this.storageManager.getItem(NEWS_KEY)) || [];
  }

  /**
   * Gets the news item by name.
   * @param {string} name - the name of the news item.
   * @returns {Promise<INewsItem | null>} a promise that resolves to the news item, or null if the news item does not
   * exist.
   */
  public async getByName(name: string): Promise<INewsItem | null> {
    const items: INewsItem[] = await this.getAll();

    return items.find((value) => value.name === name) || null;
  }

  /**
   * Removes the news item by name.
   * @param {string} name - the name of the news item.
   */
  public async removeByName(name: string): Promise<void> {
    const items: INewsItem[] = await this.getAll();

    await this.storageManager.setItems({
      [NEWS_KEY]: items.filter((value) => value.name !== name),
    });
  }

  /**
   * Saves the news item. This will update any existing news items.
   * @param {INewsItem} item - INewsItem.
   * @returns {Promise<INewsItem>} a promise that resolves to the saved news item.
   */
  public async save(item: INewsItem): Promise<INewsItem> {
    const items: INewsItem[] = await this.getAll();

    // if the item exists, just add it
    if (!items.find((value) => value.name === item.name)) {
      await this.storageManager.setItems({
        [NEWS_KEY]: [...items, item],
      });

      return item;
    }

    await this.storageManager.setItems({
      [NEWS_KEY]: items.map((value) =>
        value.name === item.name ? item : value
      ),
    });

    return item;
  }
}
