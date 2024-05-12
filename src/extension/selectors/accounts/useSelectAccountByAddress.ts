import { useSelector } from 'react-redux';

// services
import AccountService from '@extension/services/AccountService';

// types
import type {
  IAccountWithExtendedProps,
  IMainRootState,
} from '@extension/types';

/**
 * Selects an account for the supplied address.
 * @param {string} address - address of the account.
 * @returns {IAccountWithExtendedProps | null} the account for the supplied address or null.
 */
export default function useSelectAccountByAddress(
  address: string
): IAccountWithExtendedProps | null {
  return useSelector<IMainRootState, IAccountWithExtendedProps | null>(
    (state) => {
      return (
        state.accounts.items.find(
          (value) =>
            AccountService.convertPublicKeyToAlgorandAddress(
              value.publicKey
            ) === address
        ) || null
      );
    }
  );
}
