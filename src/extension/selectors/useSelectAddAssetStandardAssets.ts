import { useSelector } from 'react-redux';

// types
import { IMainRootState, IStandardAsset } from '@extension/types';

export default function useSelectAddAssetStandardAssets(): IStandardAsset[] {
  return useSelector<IMainRootState, IStandardAsset[]>(
    (state) => state.addAsset.standardAssets.items
  );
}
