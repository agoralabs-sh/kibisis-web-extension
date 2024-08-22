// constants
import { NETWORKS_ITEM_KEY } from '@extension/constants';

// services
import StorageManager from '../StorageManager';

// types
import type { INetwork, INetworkWithTransactionParams } from '@extension/types';

export default class NetworksService {
  // private variables
  private readonly storageManager: StorageManager;

  constructor() {
    this.storageManager = new StorageManager();
  }

  /**
   * public static functions
   */

  public static mapWithDefaultTransactionParams(
    value: INetwork
  ): INetworkWithTransactionParams {
    return {
      ...value,
      fee: '0',
      minFee: '0',
      updatedAt: 0,
    };
  }

  /**
   * public functions
   */

  /**
   * Gets all the networks.
   * @returns {Promise<INetworkWithTransactionParams[]>} a promise that resolves to all the networks.
   */
  public async getAll(): Promise<INetworkWithTransactionParams[]> {
    return (await this.storageManager.getItem(NETWORKS_ITEM_KEY)) || [];
  }

  /**
   * Saves the network. This will update any existing network items.
   * @param {INetworkWithTransactionParams} item - INetworkWithTransactionParams.
   * @returns {Promise<INetworkWithTransactionParams>} a promise that resolves to the saved network item.
   */
  public async save(
    item: INetworkWithTransactionParams
  ): Promise<INetworkWithTransactionParams> {
    const items = await this.getAll();

    // if the item exists, just add it
    if (!items.find((value) => value.genesisHash === item.genesisHash)) {
      await this.storageManager.setItems({
        [NETWORKS_ITEM_KEY]: [...items, item],
      });

      return item;
    }

    await this.storageManager.setItems({
      [NETWORKS_ITEM_KEY]: items.map((value) =>
        value.genesisHash === item.genesisHash ? item : value
      ),
    });

    return item;
  }

  /**
   * Saves all the networks.
   * @param {INetworkWithTransactionParams[]} items - the networks to save.
   * @returns {Promise<INetworkWithTransactionParams[]>} a promise that resolves to the saved networks.
   */
  public async saveAll(
    items: INetworkWithTransactionParams[]
  ): Promise<INetworkWithTransactionParams[]> {
    await this.storageManager.setItems({
      [NETWORKS_ITEM_KEY]: items,
    });

    return items;
  }
}
