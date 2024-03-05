// constants
import { ARC0072_ASSETS_KEY_PREFIX } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// services
import StorageManager from '../StorageManager';

// types
import type { IBaseOptions, ILogger } from '@common/types';
import type { IARC0072Asset } from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

export default class ARC0072AssetService {
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

  public static initializeDefaultARC0072Asset(): IARC0072Asset {
    return {
      id: '0',
      totalSupply: '0',
      type: AssetTypeEnum.ARC0072,
      verified: false,
    };
  }

  /**
   * private functions
   */

  /**
   * Convenience function that simply creates an item key by hex encoding the genesis hash.
   * @param {string} genesisHash - the genesis hash to use to index.
   * @returns {string} the ARC-0072 asset item key.
   */
  private createItemKey(genesisHash: string): string {
    return `${ARC0072_ASSETS_KEY_PREFIX}${convertGenesisHashToHex(
      genesisHash
    ).toUpperCase()}`;
  }

  /**
   * public functions
   */

  /**
   * Gets the ARC-0072 assets for a given genesis hash.
   * @param {string} genesisHash - genesis hash for a network.
   * @returns {Promise<IARC0072Asset[]>} the list of standard assets.
   */
  public async getByGenesisHash(genesisHash: string): Promise<IARC0072Asset[]> {
    const assets: IARC0072Asset[] | null = await this.storageManager.getItem(
      this.createItemKey(genesisHash)
    );

    if (!assets) {
      return [];
    }

    return assets.map((value) => ({
      ...ARC0072AssetService.initializeDefaultARC0072Asset(), // add any new properties
      ...value,
    }));
  }

  /**
   * Removes all the ARC-0072 assets by the network's genesis hash.
   * @param {string} genesisHash - genesis hash for a network.
   */
  public async removeByGenesisHash(genesisHash: string): Promise<void> {
    await this.storageManager.remove(this.createItemKey(genesisHash));
  }

  /**
   * Saves ARC-0072 assets to storage by the network's genesis hash.
   * @param {string} genesisHash - genesis hash for a network.
   * @param {IARC0072Asset[]} assets - the ARC-0072 assets to save to storage.
   * @returns {IARC0072Asset[]} the saved ARC-0072 assets.
   */
  public async saveByGenesisHash(
    genesisHash: string,
    assets: IARC0072Asset[]
  ): Promise<IARC0072Asset[]> {
    await this.storageManager.setItems({
      [this.createItemKey(genesisHash)]: assets,
    });

    return assets;
  }
}
