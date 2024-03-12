import { useSelector } from 'react-redux';

// types
import { IMainRootState, IStandardAsset } from '@extension/types';

export default function useSelectAddAssetsStandardAssets(): IStandardAsset[] {
  return useSelector<IMainRootState, IStandardAsset[]>(
    (state) => state.addAssets.standardAssets.items
  );
}
