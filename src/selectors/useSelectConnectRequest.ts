import { useSelector } from 'react-redux';

// Features
import { IConnectRequest } from '../features/sessions';

// Types
import { IMainRootState } from '../types';

/**
 * Selects the current connect request, or null if none exists.
 * @returns {IConnectRequest | null} the current connect request or null if it does not exist.
 */
export default function useSelectConnectRequest(): IConnectRequest | null {
  return useSelector<IMainRootState, IConnectRequest | null>(
    (state) => state.sessions.request
  );
}
