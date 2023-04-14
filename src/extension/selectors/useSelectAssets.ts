import { useSelector } from 'react-redux';

// Types
import { IAsset, IMainRootState } from '@extension/types';

/**
 * Selects all the assets for each network or null.
 * @returns {Record<string, IAsset[]> | null} all network assets, or null.
 */
export default function useSelectAssets(): Record<string, IAsset[]> | null {
  return useSelector<IMainRootState, Record<string, IAsset[]> | null>(
    (state) => state.assets.items
  );
}
