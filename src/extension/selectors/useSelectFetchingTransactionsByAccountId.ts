import { useSelector } from 'react-redux';

// features
import { IAccountTransaction } from '@extension/features/transactions';

// selectors
import useSelectAccountTransactionByAccountId from './useSelectAccountTransactionByAccountId';

// types
import { IMainRootState } from '@extension/types';

/**
 * Selects the transaction fetching state for an account.
 * @param {string} accountId - ID of the account.
 * @returns {boolean} true if transactions for the account are being fetched, false otherwise.
 */
export default function useSelectFetchingTransactionsByAccountId(
  accountId: string
): boolean {
  return useSelector<IMainRootState, boolean>(() => {
    const accountTransactions: IAccountTransaction | null =
      useSelectAccountTransactionByAccountId(accountId);

    return accountTransactions ? accountTransactions.fetching : false;
  });
}
