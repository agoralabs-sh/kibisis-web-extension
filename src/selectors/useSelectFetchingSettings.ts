import { useSelector } from 'react-redux';

// Types
import { IMainRootState } from '../types';
export default function useSelectFetchingSettings(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.settings.fetching
  );
}
