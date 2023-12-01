import { useSelector } from 'react-redux';

// types
import { IAsset, IMainRootState } from '@extension/types';

export default function useSelectSendingAssetSelectedAsset(): IAsset | null {
  return useSelector<IMainRootState, IAsset | null>(
    (state) => state.sendAssets.selectedAsset
  );
}
