import { useSelector } from 'react-redux';

// types
import { IAsset, IMainRootState } from '@extension/types';

// utils
import { convertGenesisHashToHex } from '@extension/utils';

/**
 * Selects all the assets for a given genesis hash.
 * @returns {IAsset[]} all network assets.
 */
export default function useSelectAssetsByGenesisHash(
  genesisHash: string
): IAsset[] {
  return useSelector<IMainRootState, IAsset[]>((state) => {
    if (!state.assets.items) {
      return [];
    }

    return state.assets.items[convertGenesisHashToHex(genesisHash)] || [];
  });
}
