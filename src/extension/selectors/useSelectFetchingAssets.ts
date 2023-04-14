import { useSelector } from 'react-redux';

// Types
import { IMainRootState } from '@extension/types';
export default function useSelectFetchingAssets(): boolean {
  return useSelector<IMainRootState, boolean>((state) => state.assets.fetching);
}
