// constants
import { ARC200_ASSETS_KEY_PREFIX } from '@extension/constants';

// services
import StorageManager from './StorageManager';

// types
import { IBaseOptions, ILogger } from '@common/types';
import { IArc200Asset, IStandardAsset } from '@extension/types';

// utils
import { convertGenesisHashToHex } from '@extension/utils';

export default class Arc200AssetService {
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
   * @returns {string} the arc200 asset item key.
   */
  private createItemKey(genesisHash: string): string {
    return `${ARC200_ASSETS_KEY_PREFIX}${convertGenesisHashToHex(
      genesisHash
    ).toUpperCase()}`;
  }

  /**
   * public functions
   */

  /**
   * Gets the ARC200 assets for a given genesis hash.
   * @param {string} genesisHash - genesis hash for a network.
   * @returns {Promise<IArc200Asset[]>} the list of standard assets.
   */
  public async getByGenesisHash(genesisHash: string): Promise<IArc200Asset[]> {
    return (
      (await this.storageManager.getItem(this.createItemKey(genesisHash))) || []
    );
  }

  /**
   * Removes all the ARC200 assets by the network's genesis hash.
   * @param {string} genesisHash - genesis hash for a network.
   */
  public async removeByGenesisHash(genesisHash: string): Promise<void> {
    await this.storageManager.remove(this.createItemKey(genesisHash));
  }

  /**
   * Saves ARC200 assets to storage by the network's genesis hash.
   * @param {string} genesisHash - genesis hash for a network.
   * @param {IArc200Asset[]} assets - the ARC200 assets to save to storage.
   * @returns {IArc200Asset[]} the saved ARC200 assets.
   */
  public async saveByGenesisHash(
    genesisHash: string,
    assets: IArc200Asset[]
  ): Promise<IArc200Asset[]> {
    await this.storageManager.setItems({
      [this.createItemKey(genesisHash)]: assets,
    });

    return assets;
  }
}
