import { useSelector } from 'react-redux';

// types
import { IAssetTypes, IMainRootState } from '@extension/types';

export default function useSelectAddAssetSelectedAsset(): IAssetTypes | null {
  return useSelector<IMainRootState, IAssetTypes | null>(
    (state) => state.addAssets.selectedAsset
  );
}
