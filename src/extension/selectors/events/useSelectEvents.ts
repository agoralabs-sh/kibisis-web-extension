import { useSelector } from 'react-redux';

// types
import type { IMainRootState, TEvents } from '@extension/types';

/**
 * Selects the available events.
 * @returns {TEvents[]} the available events
 */
export default function useSelectEvents(): TEvents[] {
  return useSelector<IMainRootState, TEvents[]>((state) => state.events.items);
}
