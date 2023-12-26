import { useSelector } from 'react-redux';

// types
import { IArc200Asset, IMainRootState, IStandardAsset } from '@extension/types';

export default function useSelectAddAssetSelectedAsset():
  | IArc200Asset
  | IStandardAsset
  | null {
  return useSelector<IMainRootState, IArc200Asset | IStandardAsset | null>(
    (state) => state.addAsset.selectedAsset
  );
}
