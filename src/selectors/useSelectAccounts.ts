import { useSelector } from 'react-redux';

// Types
import { IAccount, IMainRootState } from '../types';

/**
 * Selects all accounts for the selected network.
 * @returns {IAccount[]} all accounts for the selected network.
 */
export default function useSelectAccounts(): IAccount[] {
  return useSelector<IMainRootState, IAccount[]>(
    (state) => state.accounts.items
  );
}
