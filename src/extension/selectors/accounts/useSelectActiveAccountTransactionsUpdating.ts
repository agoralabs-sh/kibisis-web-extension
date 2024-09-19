import { useSelector } from 'react-redux';

// selectors
import useSelectActiveAccount from './useSelectActiveAccount';

// types
import type { IMainRootState } from '@extension/types';

/**
 * Determines if the account transactions are being updated for the active account.
 * @returns {boolean} true if the account transactions are being updated for the active account, false otherwise.
 */
export default function useSelectActiveAccountTransactionsUpdating(): boolean {
  const account = useSelectActiveAccount();

  if (!account) {
    return false;
  }

  return useSelector<IMainRootState, boolean>(
    (state) =>
      state.accounts.updateRequests.find(
        (value) => value.accountID === account.id
      )?.transactions || false
  );
}
