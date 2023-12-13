import { useSelector } from 'react-redux';

// types
import { IAsset, IMainRootState } from '@extension/types';

// utils
import { convertGenesisHashToHex } from '@extension/utils';

/**
 * Selects all the standard assets for a given genesis hash.
 * @returns {IAsset[]} all network standard assets.
 */
export default function useSelectStandardAssetsByGenesisHash(
  genesisHash: string
): IAsset[] {
  return useSelector<IMainRootState, IAsset[]>((state) => {
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
