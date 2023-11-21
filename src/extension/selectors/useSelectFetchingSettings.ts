import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';
export default function useSelectFetchingSettings(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.settings.fetching
  );
}
