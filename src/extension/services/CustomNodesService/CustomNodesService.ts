import { v4 as uuid } from 'uuid';

// constants
import { CUSTOM_NODES_KEY } from '@extension/constants';

// services
import StorageManager from '../StorageManager';

// types
import type { ICustomNodeItem } from './types';

export default class CustomNodesService {
  // private variables
  private readonly storageManager: StorageManager;

  constructor() {
    this.storageManager = new StorageManager();
  }

  /**
   * public static functions
   */

  public static initializeDefaultItem({
    algod,
    genesisHash,
    indexer,
    name,
  }: Omit<ICustomNodeItem, 'discriminator' | 'id'>): ICustomNodeItem {
    return {
      algod,
      discriminator: 'ICustomNodeItem',
      genesisHash,
      id: uuid(),
      indexer,
      name,
    };
  }

  /**
   * private functions
   */

  /**
   * public functions
   */

  /**
   * Gets all the custom node items.
   * @returns {Promise<ICustomNodeItem[]>} a promise that resolves to all the custom node items.
   */
  public async getAll(): Promise<ICustomNodeItem[]> {
    return (await this.storageManager.getItem(CUSTOM_NODES_KEY)) || [];
  }

  /**
   * Gets the custom node item by id.
   * @param {string} id - the ID of the custom node item.
   * @returns {Promise<ICustomNodeItem | null>} a promise that resolves to the custom node item, or null if the custom node
   * item does not exist.
   */
  public async getByID(id: string): Promise<ICustomNodeItem | null> {
    const items = await this.getAll();

    return items.find((value) => value.id === id) || null;
  }

  /**
   * Removes the custom node item by name.
   * @param {string} id - the ID of the custom node item.
   */
  public async removeByID(id: string): Promise<void> {
    const items = await this.getAll();

    await this.storageManager.setItems({
      [CUSTOM_NODES_KEY]: items.filter((value) => value.id !== id),
    });
  }

  /**
   * Saves the custom node item. This will update any existing custom node items if the ID matches.
   * @param {ICustomNodeItem} item - the custom node item to save.
   * @returns {Promise<ICustomNodeItem>} a promise that resolves to the saved custom node item.
   */
  public async save(item: ICustomNodeItem): Promise<ICustomNodeItem> {
    const items = await this.getAll();

    // if the item exists, just add it
    if (!items.find((value) => value.id === item.id)) {
      await this.storageManager.setItems({
        [CUSTOM_NODES_KEY]: [...items, item],
      });

      return item;
    }

    await this.storageManager.setItems({
      [CUSTOM_NODES_KEY]: items.map((value) =>
        value.id === item.id ? item : value
      ),
    });

    return item;
  }
}
