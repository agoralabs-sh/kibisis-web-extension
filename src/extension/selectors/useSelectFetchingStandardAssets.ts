import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';
export default function useSelectFetchingStandardAssets(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.standardAssets.fetching
  );
}
