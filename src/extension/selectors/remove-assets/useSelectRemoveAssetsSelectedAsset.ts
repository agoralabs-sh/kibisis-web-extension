import { useSelector } from 'react-redux';

// types
import type { IAssetTypes, IMainRootState } from '@extension/types';

export default function useSelectRemoveAssetsSelectedAsset(): IAssetTypes | null {
  return useSelector<IMainRootState, IAssetTypes | null>(
    (state) => state.removeAssets.selectedAsset
  );
}
