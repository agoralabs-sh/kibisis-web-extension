import { useSelector } from 'react-redux';

// types
import type {
  IAccount,
  IActiveAccountDetails,
  IMainRootState,
} from '@extension/types';

/**
 * Selects the active account, based on the active account details, or uses the first account in the list.
 * @returns {IAccount | null} the active account, the first account in the account list or null if no accounts exist.
 */
export default function useSelectActiveAccount(): IAccount | null {
  return useSelector<IMainRootState, IAccount | null>((state) => {
    const accounts: IAccount[] = state.accounts.items;
    const activeAccountDetails: IActiveAccountDetails | null =
      state.accounts.activeAccountDetails;
    let account: IAccount | null = null;

    // if we have the active account details, use them to get the account
    if (activeAccountDetails) {
      account =
        accounts.find((value) => value.id === activeAccountDetails.accountId) ||
        null;
    }

    // if no account exists, attempt to get the first account in the list
    return account || accounts[0] || null;
  });
}
