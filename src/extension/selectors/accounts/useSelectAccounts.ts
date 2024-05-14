import { useSelector } from 'react-redux';

// types
import type {
  IAccountWithExtendedProps,
  IMainRootState,
} from '@extension/types';

/**
 * Selects all accounts.
 * @returns {IAccountWithExtendedProps[]} all accounts.
 */
export default function useSelectAccounts(): IAccountWithExtendedProps[] {
  return useSelector<IMainRootState, IAccountWithExtendedProps[]>(
    (state) => state.accounts.items
  );
}
