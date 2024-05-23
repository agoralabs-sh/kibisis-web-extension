// services
import AccountService from '@extension/services/AccountService';

// types
import type { IAccountWithExtendedProps } from '@extension/types';
import type { IOptions } from './types';

// utils
import isReKeyedAuthAccountAvailable from '../isReKeyedAuthAccountAvailable';

/**
 * Convenience function that checks a list of accounts for the all the available accounts for a given network. The
 * account is considered available, if the account:
 * * has been re-keyed, but the auth account is also in the list of accounts and is not a watch account
 * * has not been re-keyed and is not a watch account
 * @param {IOptions} options - a list of accounts and the network.
 * @returns {IAccountWithExtendedProps[]} a list of available accounts.
 */
export default function availableAccountsForNetwork({
  accounts,
  network,
}: IOptions): IAccountWithExtendedProps[] {
  return accounts.filter((value, _, array) => {
    const accountInformation =
      AccountService.extractAccountInformationForNetwork(value, network);

    // if the account has been re-keyed, and the re-keyed account is available, add the account
    if (accountInformation && accountInformation.authAddress) {
      return isReKeyedAuthAccountAvailable({
        accounts: array,
        authAddress: accountInformation.authAddress,
      });
    }

    // if the account has not been re-keyed, check if it is a watch account
    return !value.watchAccount;
  });
}
