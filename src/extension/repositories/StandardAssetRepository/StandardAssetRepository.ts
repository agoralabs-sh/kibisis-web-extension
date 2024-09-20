// constants
import { STANDARD_ASSETS_KEY_PREFIX } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// repositories
import BaseRepository from '@extension/repositories/BaseRepository';

// types
import type { IStandardAsset } from '@extension/types';
import type { ISaveOptions } from './types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

export default class StandardAssetRepository extends BaseRepository {
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
      totalSupply: '0',
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
   * Creates an item key by hex encoding the genesis hash.
   * @param {string} genesisHash - the genesis hash to use to index.
   * @returns {string} the asset item key.
   * @private
   */
  private _createItemKey(genesisHash: string): string {
    return `${STANDARD_ASSETS_KEY_PREFIX}${convertGenesisHashToHex(
      genesisHash
    )}`;
  }

  /**
   * public functions
   */

  /**
   * Fetches the standard assets for a given genesis hash.
   * @param {string} genesisHash - genesis hash for a network.
   * @returns {Promise<IStandardAsset[]>} A promise that resolves to a list of standard assets.
   * @public
   */
  public async fetchByGenesisHash(
    genesisHash: string
  ): Promise<IStandardAsset[]> {
    const items = await this._fetchByKey<IStandardAsset[]>(
      this._createItemKey(genesisHash)
    );

    if (!items) {
      return [];
    }

    return items.map(({ total, ...currentProps }) => ({
      ...StandardAssetRepository.initializeDefaultStandardAsset(), // add any new properties
      ...currentProps,
      // parse the deprecated props
      ...(total && {
        totalSupply: total,
      }),
    }));
  }

  /**
   * Removes all the standard assets by the network's genesis hash.
   * @param {string} genesisHash - genesis hash for a network.
   * @public
   */
  public async removeByGenesisHash(genesisHash: string): Promise<void> {
    await this._removeByKeys(this._createItemKey(genesisHash));
  }

  /**
   * Saves standard assets to storage by the network's genesis hash.
   * @param {ISaveOptions} options - the genesis hash and the items.
   * @returns {Promise<IARC0200Asset[]>} A promise that resolves to the saved standard assets.
   * @public
   */
  public async saveByGenesisHash({
    genesisHash,
    items,
  }: ISaveOptions): Promise<IStandardAsset[]> {
    await this._save<IStandardAsset[]>({
      [this._createItemKey(genesisHash)]: items,
    });

    return items;
  }
}
