import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';

export default function useSelectAddAssetFetching(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.addAsset.fetching
  );
}
