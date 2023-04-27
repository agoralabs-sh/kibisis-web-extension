import { useSelector } from 'react-redux';

// Types
import { IAccount, IMainRootState } from '@extension/types';
import { AccountService } from '@extension/services';

/**
 * Selects the first account in the list. If the address  is supplied, that account is returned.
 * @param {string} address - [optional] the address.
 * @returns {IAccount | null} the account for the supplied address, the first account in the account list or null.
 */
export default function useSelectAccount(address?: string): IAccount | null {
  return useSelector<IMainRootState, IAccount | null>((state) => {
    return useSelector<IMainRootState, IAccount | null>((state) => {
      const accounts: IAccount[] = state.accounts.items;

      // if we have an address, find the account associated
      if (address) {
        return (
          accounts.find(
            (value) =>
              AccountService.convertPublicKeyToAlgorandAddress(
                value.publicKey
              ) === address
          ) || null
        );
      }

      // return the account at the top of the list, or null
      return state.accounts.items[0] || null;
    });
  });
}
