import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';
export default function useSelectFetchingARC0200Assets(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.arc200Assets.fetching
  );
}
