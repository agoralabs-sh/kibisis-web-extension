import { useSelector } from 'react-redux';

// types
import type { IActiveAccountDetails, IMainRootState } from '@extension/types';

/**
 * Selects the active account details.
 * @returns {IActiveAccountDetails | null} the active account details or null.
 */
export default function useSelectActiveAccountDetails(): IActiveAccountDetails | null {
  return useSelector<IMainRootState, IActiveAccountDetails | null>(
    (state) => state.accounts.activeAccountDetails
  );
}
