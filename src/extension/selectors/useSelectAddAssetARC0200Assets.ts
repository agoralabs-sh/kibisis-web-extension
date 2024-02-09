import { useSelector } from 'react-redux';

// types
import { IARC0200Asset, IMainRootState } from '@extension/types';

export default function useSelectAddAssetARC0200Assets(): IARC0200Asset[] {
  return useSelector<IMainRootState, IARC0200Asset[]>(
    (state) => state.addAsset.arc200Assets.items
  );
}
