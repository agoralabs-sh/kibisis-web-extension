import { useSelector } from 'react-redux';

// selectors
import useSelectActiveAccount from './useSelectActiveAccount';

// types
import type { IAccountGroup, IMainRootState } from '@extension/types';

/**
 * Selects the active account group, or null if it doesn't exist.
 * @returns {IAccountGroup | null} The active account group, or null.
 */
export default function useSelectActiveAccountGroup(): IAccountGroup | null {
  const account = useSelectActiveAccount();

  if (!account || !account.groupID) {
    return null;
  }

  return useSelector<IMainRootState, IAccountGroup | null>(
    ({ accounts }) =>
      accounts.groups.find(({ id }) => id === account.groupID) || null
  );
}
