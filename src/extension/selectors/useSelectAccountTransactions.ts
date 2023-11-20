import { useSelector } from 'react-redux';

// features
import { IAccountTransaction } from '@extension/features/transactions';

// types
import { IMainRootState } from '@extension/types';

/**
 * Selects all the account transactions.
 * @returns {IAccountTransaction[]} all the account transactions.
 */
export default function useSelectAccountTransactions(): IAccountTransaction[] {
  return useSelector<IMainRootState, IAccountTransaction[]>(
    (state) => state.transactions.items
  );
}
