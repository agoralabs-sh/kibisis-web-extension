import { useSelector } from 'react-redux';

// Types
import { IMainRootState, ISession } from '../types';

/**
 * Fetches all the available sessions.
 * @returns {ISession[]} the available sessions.
 */
export default function useSelectSessions(): ISession[] {
  return useSelector<IMainRootState, ISession[]>(
    (state) => state.sessions.items
  );
}
