// types
import { IArc200Asset, IStandardAsset } from '@extension/types';

// utils
import convertGenesisHashToHex from '../convertGenesisHashToHex';

/**
 * Convenience function that gets a list of the assets for a network.
 * @param {Record<string, (IStandardAsset | IArc200Asset)[]> | null} assets - the list of assets from the store.
 * @param {string} genesisHash - the network genesis hash to query.
 * @returns {(IStandardAsset | IArc200Asset)[]} a list of assets for the network.
 */
export default function selectAssetsForNetwork<
  T = IStandardAsset | IArc200Asset
>(assets: Record<string, T[]> | null, genesisHash: string): T[] {
  if (!assets) {
    return [];
  }

  return assets[convertGenesisHashToHex(genesisHash).toUpperCase()] || [];
}
