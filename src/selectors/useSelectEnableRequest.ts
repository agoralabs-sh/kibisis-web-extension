import { useSelector } from 'react-redux';

// Types
import { IEnableRequest, IMainRootState } from '../types';

/**
 * Selects the current enable request, or null if none exists.
 * @returns {IEnableRequest | null} the current enable request or null if it does not exist.
 */
export default function useSelectEnableRequest(): IEnableRequest | null {
  return useSelector<IMainRootState, IEnableRequest | null>(
    (state) => state.messages.enableRequest
  );
}
