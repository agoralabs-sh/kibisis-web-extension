import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';

/**
 * Selects the account transactions updating state.
 * @returns {boolean} true if the account transactions are being updated, false otherwise.
 */
export default function useSelectUpdatingAccountTransactions(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state: IMainRootState) => state.accounts.updatingTransactions
  );
}
