import { useSelector } from 'react-redux';

// Types
import { IAccount, IMainRootState } from '../types';

/**
 * Selects the first account. If address is specified, it returns that account or null.
 * @param {string} address - [optional] the account to return.
 * @returns {IAccount | null} the account. If an address is specified, it will return that account, or null.
 */
export default function useSelectAccount(address?: string): IAccount | null {
  return useSelector<IMainRootState, IAccount | null>((state) => {
    const accounts: IAccount[] = state.accounts.items;

    // if we have an address, find the account associated
    if (address) {
      return accounts.find((value) => value.address === address) || null;
    }

    // return the account at the top of the list, or null
    return state.accounts.items[0] || null;
  });
}
