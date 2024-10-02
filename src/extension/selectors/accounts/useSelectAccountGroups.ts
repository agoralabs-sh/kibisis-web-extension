import { useSelector } from 'react-redux';

// types
import type { IAccountGroup, IMainRootState } from '@extension/types';

/**
 * Selects all account groups.
 * @returns {IAccountGroup[]} All account groups.
 */
export default function useSelectAccounts(): IAccountGroup[] {
  return useSelector<IMainRootState, IAccountGroup[]>(
    (state) => state.accounts.groups
  );
}
