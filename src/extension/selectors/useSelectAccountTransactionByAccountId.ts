import { useSelector } from 'react-redux';

// Features
import { IAccountTransaction } from '@extension/features/transactions';

// Types
import { IMainRootState } from '@extension/types';

/**
 * Selects the account transactions for the supplied ID.
 * @param {string} accountId - ID of the account.
 * @returns {IAccountTransaction | null} the account transactions for the supplied account ID or null.
 */
export default function useSelectAccountTransactionByAccountId(
  accountId: string
): IAccountTransaction | null {
  return useSelector<IMainRootState, IAccountTransaction | null>((state) => {
    return (
      state.transactions.items.find((value) => value.accountId === accountId) ||
      null
    );
  });
}
