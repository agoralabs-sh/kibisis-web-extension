// constants
import { STANDARD_ASSETS_KEY_PREFIX } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

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
   * public static functions
   */

  public static initializeDefaultStandardAsset(): IStandardAsset {
    return {
      clawbackAddress: null,
      creator: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      decimals: 0,
      defaultFrozen: false,
      deleted: false,
      freezeAddress: null,
      iconUrl: null,
      id: '0',
      managerAddress: null,
      metadataHash: null,
      name: null,
      nameBase64: null,
      reserveAddress: null,
      total: '0',
      type: AssetTypeEnum.Standard,
      unitName: null,
      unitNameBase64: null,
      url: null,
      urlBase64: null,
      verified: false,
    };
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
    const assets: IStandardAsset[] | null = await this.storageManager.getItem(
      this.createItemKey(genesisHash)
    );

    if (!assets) {
      return [];
    }

    return assets.map((value) => ({
      ...StandardAssetService.initializeDefaultStandardAsset(), // add any new properties
      ...value,
    }));
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
