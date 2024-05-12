// selectors
import useSelectSelectedNetwork from '../networks/useSelectSelectedNetwork';
import useSelectActiveAccount from './useSelectActiveAccount';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { IAccountTransactions } from '@extension/types';

/**
 * Gets the account transactions associated with the active account. If no active account is found, the account
 * transactions for first account in the list is returned.
 * @returns {IAccountInformation | null} the account transactions for the active account, the account transactions for
 * first account in the account list or null.
 */
export default function useSelectActiveAccountTransactions(): IAccountTransactions | null {
  const account = useSelectActiveAccount();
  const network = useSelectSelectedNetwork();

  if (!account || !network) {
    return null;
  }

  return AccountService.extractAccountTransactionsForNetwork(account, network);
}
