// configs
import { networks } from '@extension/config';

// constants
import { NETWORKS_ITEM_KEY } from '@extension/constants';

// services
import StorageManager from '../StorageManager';

// types
import type { INetwork, INetworkWithTransactionParams } from '@extension/types';
import type { ISerializableNetworkWithTransactionParams } from './types';

export default class NetworksService {
  // private variables
  private readonly _storageManager: StorageManager;

  constructor() {
    this._storageManager = new StorageManager();
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
   * private functions
   */

  /**
   * Local storage needs serializable JSONs (for example no functions), so this function acts as a way to "deserialize"
   * the object, by initializing the objects that need to be initialized.
   * @param {ISerializableNetworkWithTransactionParams} value - the serialized item.
   * @returns {INetworkWithTransactionParams} the deserialized object.
   * @private
   */
  private _deserialize(
    value: ISerializableNetworkWithTransactionParams
  ): INetworkWithTransactionParams {
    return {
      ...value,
      arc0072Indexers:
        networks.find((_value) => _value.genesisHash === _value.genesisHash)
          ?.arc0072Indexers || [],
      blockExplorers:
        networks.find((_value) => _value.genesisHash === _value.genesisHash)
          ?.blockExplorers || [],
      nftExplorers:
        networks.find((_value) => _value.genesisHash === _value.genesisHash)
          ?.nftExplorers || [],
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
    const items =
      (await this._storageManager.getItem<
        ISerializableNetworkWithTransactionParams[]
      >(NETWORKS_ITEM_KEY)) || [];

    return items.map(this._deserialize);
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
      await this._storageManager.setItems({
        [NETWORKS_ITEM_KEY]: [...items, item],
      });

      return item;
    }

    await this._storageManager.setItems({
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
    await this._storageManager.setItems({
      [NETWORKS_ITEM_KEY]: items,
    });

    return items;
  }
}
