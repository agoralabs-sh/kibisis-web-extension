import { useSelector } from 'react-redux';

// Types
import { IAccount, IMainRootState } from '../types';

/**
 * Selects all accounts.
 * @returns {IAccount[]} all accounts.
 */
export default function useSelectAccounts(): IAccount[] {
  return useSelector<IMainRootState, IAccount[]>(
    (state) => state.accounts.items
  );
}
