// constants
import { STANDARD_ASSETS_KEY_PREFIX } from '@extension/constants';

// services
import StorageManager from './StorageManager';

// types
import { IBaseOptions, ILogger } from '@common/types';
import { IStandardAsset } from '@extension/types';

// utils
import { convertGenesisHashToHex } from '@extension/utils';

export default class StandardAssetService {
  // private variables
  private readonly logger: ILogger | null;
  private readonly storageManager: StorageManager;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
    this.storageManager = new StorageManager();
  }

  /**
   * private functions
   */

  /**
   * Convenience function that simply creates an item key by hex encoding the genesis hash.
   * @param {string} genesisHash - the genesis hash to use to index.
   * @returns {string} the asset item key.
   */
  private createItemKey(genesisHash: string): string {
    return `${STANDARD_ASSETS_KEY_PREFIX}${convertGenesisHashToHex(
      genesisHash
    ).toUpperCase()}`;
  }

  /**
   * public functions
   */

  /**
   * Gets the standard assets for a given genesis hash.
   * @param {string} genesisHash - genesis hash for a network.
   * @returns {Promise<IStandardAsset[]>} the list of standard assets.
   */
  public async getByGenesisHash(
    genesisHash: string
  ): Promise<IStandardAsset[]> {
    return (
      (await this.storageManager.getItem(this.createItemKey(genesisHash))) || []
    );
  }

  /**
   * Removes all the standard assets by the network's genesis hash.
   * @param {string} genesisHash - genesis hash for a network.
   */
  public async removeByGenesisHash(genesisHash: string): Promise<void> {
    await this.storageManager.remove(this.createItemKey(genesisHash));
  }

  /**
   * Saves standard assets to storage by the network's genesis hash.
   * @param {string} genesisHash - genesis hash for a network.
   * @param {IStandardAsset[]} assets - the standard assets to save to storage.
   * @returns {IStandardAsset[]} the saved standard assets.
   */
  public async saveByGenesisHash(
    genesisHash: string,
    assets: IStandardAsset[]
  ): Promise<IStandardAsset[]> {
    await this.storageManager.setItems({
      [this.createItemKey(genesisHash)]: assets,
    });

    return assets;
  }
}
