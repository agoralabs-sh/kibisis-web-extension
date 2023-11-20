import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';
export default function useSelectFetchingAssets(): boolean {
  return useSelector<IMainRootState, boolean>((state) => state.assets.fetching);
}
