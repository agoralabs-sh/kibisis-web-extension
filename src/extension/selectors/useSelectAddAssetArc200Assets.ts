import { useSelector } from 'react-redux';

// types
import { IArc200Asset, IMainRootState } from '@extension/types';

export default function useSelectAddAssetArc200Assets(): IArc200Asset[] {
  return useSelector<IMainRootState, IArc200Asset[]>(
    (state) => state.addAsset.arc200Assets.items
  );
}
