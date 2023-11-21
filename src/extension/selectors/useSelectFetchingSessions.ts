import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';
export default function useSelectFetchingSessions(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.sessions.fetching
  );
}
