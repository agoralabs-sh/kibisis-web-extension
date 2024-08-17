import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@extension/types';

export default function useSelectCustomNodesFetching(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.customNodes.fetching
  );
}
