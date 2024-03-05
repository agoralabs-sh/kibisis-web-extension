import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@extension/types';

export default function useSelectARC0200AssetsFetching(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.arc200Assets.fetching
  );
}
