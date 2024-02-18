import { useSelector } from 'react-redux';

// types
import type { IAccount, IMainRootState } from '@extension/types';

/**
 * Selects all accounts.
 * @returns {IAccount[]} all accounts.
 */
export default function useSelectAccounts(): IAccount[] {
  return useSelector<IMainRootState, IAccount[]>(
    (state) => state.accounts.items
  );
}
