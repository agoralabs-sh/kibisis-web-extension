import { useSelector } from 'react-redux';

// Features
import { ISignDataRequest } from '../features/accounts';

// Types
import { IMainRootState } from '../types';

/**
 * Selects the current sign data request, or null if none exists.
 * @returns {ISignDataRequest | null} the current sign data request or null if it does not exist.
 */
export default function useSelectSignDataRequest(): ISignDataRequest | null {
  return useSelector<IMainRootState, ISignDataRequest | null>(
    (state) => state.accounts.signDataRequest
  );
}
