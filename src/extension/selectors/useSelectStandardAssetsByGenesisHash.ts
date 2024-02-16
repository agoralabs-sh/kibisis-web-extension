import { useSelector } from 'react-redux';

// types
import { IStandardAsset, IMainRootState } from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

/**
 * Selects all the standard assets for a given genesis hash.
 * @param {string} genesisHash - the genesis hash.
 * @returns {IStandardAsset[]} all network standard assets.
 */
export default function useSelectStandardAssetsByGenesisHash(
  genesisHash: string
): IStandardAsset[] {
  return useSelector<IMainRootState, IStandardAsset[]>((state) => {
    if (!state.standardAssets.items) {
      return [];
    }

    return (
      state.standardAssets.items[
        convertGenesisHashToHex(genesisHash).toUpperCase()
      ] || []
    );
  });
}
