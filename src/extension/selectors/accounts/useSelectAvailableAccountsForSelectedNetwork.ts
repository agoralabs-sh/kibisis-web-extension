// selectors
import useSelectAccounts from './useSelectAccounts';
import useSelectSelectedNetwork from '../networks/useSelectSelectedNetwork';

// types
import type { IAccountWithExtendedProps } from '@extension/types';

// utils
import availableAccountsForNetwork from '@extension/utils/availableAccountsForNetwork';

/**
 * Gets all the available accounts that can be used for signing operations for the selected network. A valid account is
 * defined as a non-watch account (has a private key stored), or the account is re-keyed and the auth account's
 * private key is present.
 * @returns {IAccountWithExtendedProps[]} all accounts that are available to sign for the selected network.
 */
export default function useSelectAvailableAccountsForSelectedNetwork(): IAccountWithExtendedProps[] {
  const accounts = useSelectAccounts();
  const network = useSelectSelectedNetwork();

  if (!network) {
    return [];
  }

  return availableAccountsForNetwork({
    accounts,
    network,
  });
}
