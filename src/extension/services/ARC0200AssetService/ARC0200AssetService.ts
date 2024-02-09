// constants
import { ARC200_ASSETS_KEY_PREFIX } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// services
import StorageManager from '../StorageManager';

// types
import { IBaseOptions, ILogger } from '@common/types';
import { IARC0200Asset } from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

export default class ARC0200AssetService {
  // private variables
  private readonly logger: ILogger | null;
  private readonly storageManager: StorageManager;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
    this.storageManager = new StorageManager();
  }

  /**
   * public static functions
   */

  public static initializeDefaultArc200Asset(): IARC0200Asset {
    return {
      decimals: 0,
      iconUrl: null,
      id: '0',
      name: 'Null',
      symbol: 'NULL',
      totalSupply: '0',
      type: AssetTypeEnum.ARC0200,
      verified: false,
    };
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
  public async getByGenesisHash(genesisHash: string): Promise<IARC0200Asset[]> {
    const assets: IARC0200Asset[] | null = await this.storageManager.getItem(
      this.createItemKey(genesisHash)
    );

    if (!assets) {
      return [];
    }

    return assets.map((value) => ({
      ...ARC0200AssetService.initializeDefaultArc200Asset(), // add any new properties
      ...value,
    }));
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
    assets: IARC0200Asset[]
  ): Promise<IARC0200Asset[]> {
    await this.storageManager.setItems({
      [this.createItemKey(genesisHash)]: assets,
    });

    return assets;
  }
}
