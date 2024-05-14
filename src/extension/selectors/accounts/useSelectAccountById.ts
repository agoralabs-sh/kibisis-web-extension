import { useSelector } from 'react-redux';

// types
import type {
  IAccountWithExtendedProps,
  IMainRootState,
} from '@extension/types';

/**
 * Selects an account for the supplied ID.
 * @param {string} id - ID of the account.
 * @returns {IAccountWithExtendedProps | null} the account for the supplied ID or null.
 */
export default function useSelectAccountById(
  id: string
): IAccountWithExtendedProps | null {
  return useSelector<IMainRootState, IAccountWithExtendedProps | null>(
    (state) => {
      return state.accounts.items.find((value) => value.id === id) || null;
    }
  );
}
