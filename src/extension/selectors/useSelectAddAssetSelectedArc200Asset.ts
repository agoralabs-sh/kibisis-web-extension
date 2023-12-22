import { useSelector } from 'react-redux';

// types
import { IArc200Asset, IMainRootState } from '@extension/types';

export default function useSelectAddAssetSelectedArc200Asset(): IArc200Asset | null {
  return useSelector<IMainRootState, IArc200Asset | null>(
    (state) => state.addAsset.selectedArc200Asset
  );
}
