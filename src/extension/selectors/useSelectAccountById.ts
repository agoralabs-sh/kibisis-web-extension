import { useSelector } from 'react-redux';

// types
import { IAccount, IMainRootState } from '@extension/types';

/**
 * Selects an account for the supplied ID.
 * @param {string} id - ID of the account.
 * @returns {IAccount | null} the account for the supplied ID or null.
 */
export default function useSelectAccountById(id: string): IAccount | null {
  return useSelector<IMainRootState, IAccount | null>((state) => {
    return state.accounts.items.find((value) => value.id === id) || null;
  });
}
