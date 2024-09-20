// constants
import { ARC0200_ASSETS_KEY_PREFIX } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// repositories
import BaseRepository from '@extension/repositories/BaseRepository';

// types
import type { IARC0200Asset } from '@extension/types';
import type { ISaveOptions } from './types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

export default class ARC0200AssetRepository extends BaseRepository {
  /**
   * public static functions
   */

  public static initializeDefaultARC0200Asset(): IARC0200Asset {
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
   * @private
   */
  private _createItemKey(genesisHash: string): string {
    return `${ARC0200_ASSETS_KEY_PREFIX}${convertGenesisHashToHex(
      genesisHash
    )}`;
  }

  /**
   * public functions
   */

  /**
   * Fetches the ARC-0200 assets for a given genesis hash.
   * @param {string} genesisHash - The genesis hash for a network.
   * @returns {Promise<IARC0200Asset[]>} A promise that resolves to a list of ARC-0202 assets.
   * @public
   */
  public async fetchByGenesisHash(
    genesisHash: string
  ): Promise<IARC0200Asset[]> {
    const items = await this._fetchByKey<IARC0200Asset[]>(
      this._createItemKey(genesisHash)
    );

    if (!items) {
      return [];
    }

    return items.map((value) => ({
      ...ARC0200AssetRepository.initializeDefaultARC0200Asset(), // add any new properties
      ...value,
    }));
  }

  /**
   * Removes all the ARC-0200 assets by the network's genesis hash.
   * @param {string} genesisHash - genesis hash for a network.
   * @public
   */
  public async removeByGenesisHash(genesisHash: string): Promise<void> {
    await this._removeByKeys(this._createItemKey(genesisHash));
  }

  /**
   * Saves ARC-0200 assets to storage by the network's genesis hash.
   * @param {ISaveOptions} options - the genesis hash and the items.
   * @returns {Promise<IARC0200Asset[]>} A promise that resolves to the saved ARC-0200 assets.
   * @public
   */
  public async saveByGenesisHash({
    genesisHash,
    items,
  }: ISaveOptions): Promise<IARC0200Asset[]> {
    await this._save<IARC0200Asset[]>({
      [this._createItemKey(genesisHash)]: items,
    });

    return items;
  }
}
