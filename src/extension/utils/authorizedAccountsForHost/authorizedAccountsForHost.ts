// services
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IAccountWithExtendedProps } from '@extension/types';
import type { IOptions } from './types';

// utils
import convertPublicKeyToAVMAddress from '../convertPublicKeyToAVMAddress';

/**
 * Convenience function that gets a list of authorized accounts for sessions matching the host.
 * @param {IOptions} options - a list of accounts, sessions and the host.
 * @returns {IAccountWithExtendedProps[]} the filtered list of accounts that are authorized for the host.
 */
export default function authorizedAccountsForHost({
  accounts,
  host,
  sessions,
}: IOptions): IAccountWithExtendedProps[] {
  return sessions
    .filter((value) => value.host === host)
    .reduce<IAccountWithExtendedProps[]>((acc, currentValue) => {
      return [
        ...acc,
        ...accounts.filter(
          (account) =>
            !acc.some((value) => value.id === account.id) && // add if it is not already in the list..
            currentValue.authorizedAddresses.some(
              (value) =>
                value ===
                convertPublicKeyToAVMAddress(
                  PrivateKeyService.decode(account.publicKey)
                )
            ) // and if the account is in the authorized addresses of the host
        ),
      ];
    }, []);
}
