import { useSelector } from 'react-redux';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { IAccount, IMainRootState } from '@extension/types';

/**
 * Selects an account for the supplied address.
 * @param {string} address - address of the account.
 * @returns {IAccount | null} the account for the supplied address or null.
 */
export default function useSelectAccountByAddress(
  address: string
): IAccount | null {
  return useSelector<IMainRootState, IAccount | null>((state) => {
    return (
      state.accounts.items.find(
        (value) =>
          AccountService.convertPublicKeyToAlgorandAddress(value.publicKey) ===
          address
      ) || null
    );
  });
}
