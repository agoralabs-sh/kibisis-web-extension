// types
import {
  IAccount,
  IAccountTransactions,
  INetworkWithTransactionParams,
} from '@extension/types';
import { AccountService } from '@extension/services';

// selectors
import useSelectAccountByAddress from './useSelectAccountByAddress';
import useSelectSelectedNetwork from './useSelectSelectedNetwork';

/**
 * Gets the account transactions associated with the address. If no address is supplied, the account transactions for
 * first account in the list is returned.
 * @param {string} address - [optional] the address.
 * @returns {IAccountInformation | null} the account transactions for the supplied address, the account transactions for
 * first account in the account list or null.
 */
export default function useSelectAccountTransactionsByAddress(
  address?: string
): IAccountTransactions | null {
  const account: IAccount | null = useSelectAccountByAddress(address);
  const network: INetworkWithTransactionParams | null =
    useSelectSelectedNetwork();

  if (!account || !network) {
    console.log('here');
    return null;
  }

  return AccountService.extractAccountTransactionsForNetwork(account, network);
}
