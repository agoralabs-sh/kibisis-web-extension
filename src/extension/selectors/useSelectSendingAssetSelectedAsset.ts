import { useSelector } from 'react-redux';

// types
import { IStandardAsset, IMainRootState } from '@extension/types';

export default function useSelectSendingAssetSelectedAsset(): IStandardAsset | null {
  return useSelector<IMainRootState, IStandardAsset | null>(
    (state) => state.sendAssets.selectedAsset
  );
}
