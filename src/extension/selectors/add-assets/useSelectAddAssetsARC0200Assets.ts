import { useSelector } from 'react-redux';

// types
import { IARC0200Asset, IMainRootState } from '@extension/types';

export default function useSelectAddAssetsARC0200Assets(): IARC0200Asset[] {
  return useSelector<IMainRootState, IARC0200Asset[]>(
    (state) => state.addAssets.arc200Assets.items
  );
}
