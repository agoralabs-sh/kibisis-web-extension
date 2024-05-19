// selectors
import useSelectAccounts from './useSelectAccounts';
import useSelectSelectedNetwork from '../networks/useSelectSelectedNetwork';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { IAccountWithExtendedProps } from '@extension/types';

// utils
import isReKeyedAuthAccountAvailable from '@extension/utils/isReKeyedAuthAccountAvailable';

/**
 * Gets all the available accounts that can be used for signing operations for the selected network. A valid account is
 * defined as is not a watch account (has a private key stored), or the account is re-keyed and the auth account's
 * private key is present.
 * @returns {IAccountWithExtendedProps[]} all accounts that are available to sign for the selected network.
 */
export default function useSelectAvailableAccountsForSelectedNetwork(): IAccountWithExtendedProps[] {
  const accounts = useSelectAccounts();
  const network = useSelectSelectedNetwork();

  if (!network) {
    return [];
  }

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
