import { useSelector } from 'react-redux';

// types
import type {
  IAccountWithExtendedProps,
  IActiveAccountDetails,
  IMainRootState,
} from '@extension/types';

/**
 * Selects the active account, based on the active account details, or uses the first account in the list.
 * @returns {IAccountWithExtendedProps | null} the active account, the first account in the account list or null if no accounts exist.
 */
export default function useSelectActiveAccount(): IAccountWithExtendedProps | null {
  return useSelector<IMainRootState, IAccountWithExtendedProps | null>(
    (state) => {
      const accounts = state.accounts.items;
      const activeAccountDetails: IActiveAccountDetails | null =
        state.accounts.activeAccountDetails;
      let account: IAccountWithExtendedProps | null = null;

      // if we have the active account details, use them to get the account
      if (activeAccountDetails) {
        account =
          accounts.find(
            (value) => value.id === activeAccountDetails.accountId
          ) || null;
      }

      // if no account exists, attempt to get the first account in the list
      return account || accounts[0] || null;
    }
  );
}
