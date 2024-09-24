// configs
import { networks } from '@extension/config';

// constants
import { NETWORKS_ITEM_KEY } from '@extension/constants';

// repositories
import BaseRepository from '@extension/repositories/BaseRepository';

// types
import type { INetwork, INetworkWithTransactionParams } from '@extension/types';
import type { ISerializableNetworkWithTransactionParams } from './types';

export default class NetworksRepository extends BaseRepository {
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
        networks.find((_value) => _value.genesisHash === value.genesisHash)
          ?.arc0072Indexers || [],
      blockExplorers:
        networks.find((_value) => _value.genesisHash === value.genesisHash)
          ?.blockExplorers || [],
      nftExplorers:
        networks.find((_value) => _value.genesisHash === value.genesisHash)
          ?.nftExplorers || [],
    };
  }

  private async _fetchSerializedFromStorage(): Promise<
    ISerializableNetworkWithTransactionParams[]
  > {
    return (
      (await this._fetchByKey<ISerializableNetworkWithTransactionParams[]>(
        NETWORKS_ITEM_KEY
      )) || []
    );
  }

  /**
   * Local storage needs serializable JSONs (for example no functions), so this function acts as a way to "serialize"
   * the object to the safe properties.
   * @param {INetworkWithTransactionParams} value - the item to serialize.
   * @returns {ISerializableNetworkWithTransactionParams} the serialized object.
   * @private
   */
  private _serialize(
    value: INetworkWithTransactionParams
  ): ISerializableNetworkWithTransactionParams {
    return {
      ...value,
      arc0072Indexers: value.arc0072Indexers.map(({ canonicalName, id }) => ({
        canonicalName,
        id,
      })),
      blockExplorers: value.blockExplorers.map(({ canonicalName, id }) => ({
        canonicalName,
        id,
      })),
      nftExplorers: value.nftExplorers.map(({ canonicalName, id }) => ({
        canonicalName,
        id,
      })),
    };
  }

  /**
   * public functions
   */

  /**
   * Gets all the networks.
   * @returns {Promise<INetworkWithTransactionParams[]>} A promise that resolves to all the networks.
   * @public
   */
  public async fetchAll(): Promise<INetworkWithTransactionParams[]> {
    const items = await this._fetchSerializedFromStorage();

    return items.map(this._deserialize);
  }

  /**
   * Saves the network. This will update an existing network item.
   * @param {INetworkWithTransactionParams} item - The network to save.
   * @returns {Promise<INetworkWithTransactionParams>} A promise that resolves to the saved network item.
   * @public
   */
  public async save(
    item: INetworkWithTransactionParams
  ): Promise<INetworkWithTransactionParams> {
    const serializedItems = await this._fetchSerializedFromStorage();
    const serializedItem = this._serialize(item);

    // if the item exists, just add it
    if (
      !serializedItems.find((value) => value.genesisHash === item.genesisHash)
    ) {
      await this._save<ISerializableNetworkWithTransactionParams[]>({
        [NETWORKS_ITEM_KEY]: [...serializedItems, serializedItem],
      });

      return item;
    }

    await this._save<ISerializableNetworkWithTransactionParams[]>({
      [NETWORKS_ITEM_KEY]: serializedItems.map((value) =>
        value.genesisHash === item.genesisHash ? serializedItem : value
      ),
    });

    return item;
  }

  /**
   * Saves all the networks.
   * @param {INetworkWithTransactionParams[]} items - The networks to save.
   * @returns {Promise<INetworkWithTransactionParams[]>} A promise that resolves to the saved networks.
   * @public
   */
  public async saveAll(
    items: INetworkWithTransactionParams[]
  ): Promise<INetworkWithTransactionParams[]> {
    await this._save<ISerializableNetworkWithTransactionParams[]>({
      [NETWORKS_ITEM_KEY]: items.map(this._serialize),
    });

    return items;
  }
}
