import { useSelector } from 'react-redux';

// types
import type { IAccountUpdateRequest } from '@extension/features/accounts';
import type { IBackgroundRootState, IMainRootState } from '@extension/types';

/**
 * Gets the accounts being updated.
 * @returns {IAccountUpdateRequest[]} the updating accounts.
 */
export default function useSelectAccounts(): IAccountUpdateRequest[] {
  return useSelector<
    IBackgroundRootState | IMainRootState,
    IAccountUpdateRequest[]
  >((state) => state.accounts.updateRequests);
}
