import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';

export default function useSelectAddAssetsFetching(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.addAssets.fetching
  );
}
