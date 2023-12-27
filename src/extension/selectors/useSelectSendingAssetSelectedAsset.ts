import { useSelector } from 'react-redux';

// types
import { IStandardAsset, IMainRootState, IArc200Asset } from '@extension/types';

export default function useSelectSendingAssetSelectedAsset():
  | IArc200Asset
  | IStandardAsset
  | null {
  return useSelector<IMainRootState, IArc200Asset | IStandardAsset | null>(
    (state) => state.sendAssets.selectedAsset
  );
}
