// constants
import { ARC0072_ASSETS_KEY_PREFIX } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// repositories
import BaseRepository from '@extension/repositories/BaseRepository';

// types
import type { IARC0072Asset } from '@extension/types';
import type { ISaveOptions } from './types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

export default class ARC0072AssetRepository extends BaseRepository {
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
   * Creates an item key by hex encoding the genesis hash.
   * @param {string} genesisHash - the genesis hash to use to index.
   * @returns {string} the ARC-0072 asset item key.
   */
  private _createItemKey(genesisHash: string): string {
    return `${ARC0072_ASSETS_KEY_PREFIX}${convertGenesisHashToHex(
      genesisHash
    )}`;
  }

  /**
   * public functions
   */

  /**
   * Fetches the ARC-0072 assets for a given genesis hash.
   * @param {string} genesisHash - The genesis hash for a network.
   * @returns {Promise<IARC0072Asset[]>} A promise that resolves to a list of ARC-0072 assets.
   * @public
   */
  public async fetchByGenesisHash(
    genesisHash: string
  ): Promise<IARC0072Asset[]> {
    const items = await this._fetchByKey<IARC0072Asset[]>(
      this._createItemKey(genesisHash)
    );

    if (!items) {
      return [];
    }

    return items.map((value) => ({
      ...ARC0072AssetRepository.initializeDefaultARC0072Asset(), // add any new properties
      ...value,
    }));
  }

  /**
   * Removes all the ARC-0072 assets by the network's genesis hash.
   * @param {string} genesisHash - genesis hash for a network.
   * @public
   */
  public async removeByGenesisHash(genesisHash: string): Promise<void> {
    await this._removeByKeys(this._createItemKey(genesisHash));
  }

  /**
   * Saves ARC-0072 assets to storage by the network's genesis hash.
   * @param {ISaveOptions} options - the genesis hash and the items.
   * @returns {Promise<IARC0072Asset[]>} A promise that resolves to the saved ARC-0072 assets.
   * @public
   */
  public async saveByGenesisHash({
    genesisHash,
    items,
  }: ISaveOptions): Promise<IARC0072Asset[]> {
    await this._save<IARC0072Asset[]>({
      [this._createItemKey(genesisHash)]: items,
    });

    return items;
  }
}
