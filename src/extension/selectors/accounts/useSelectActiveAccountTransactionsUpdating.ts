import { useSelector } from 'react-redux';

// selectors
import useSelectActiveAccount from './useSelectActiveAccount';

// types
import type { IBackgroundRootState, IMainRootState } from '@extension/types';

/**
 * Determines if the account transactions are being updated for the active account.
 * @returns {boolean} true if the account transactions are being updated for the active account, false otherwise.
 */
export default function useSelectActiveAccountTransactionsUpdating(): boolean {
  const account = useSelectActiveAccount();

  if (!account) {
    return false;
  }

  return useSelector<IBackgroundRootState | IMainRootState, boolean>(
    (state) => {
      const updateRequests = state.accounts.updateRequests.filter(
        ({ accountIDs }) => accountIDs.some((value) => value === account.id)
      );

      return updateRequests.some(({ transactions }) => transactions);
    }
  );
}
