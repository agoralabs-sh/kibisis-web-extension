// types
import {
  IAccount,
  IAccountInformation,
  INetworkWithTransactionParams,
} from '@extension/types';
import AccountService from '@extension/services/AccountService';

// selectors
import useSelectAccountByAddress from './useSelectAccountByAddress';
import useSelectSelectedNetwork from './useSelectSelectedNetwork';

/**
 * Gets the account information associated with the address. If no address is supplied, the account information for
 * first account in the list is returned.
 * @param {string} address - [optional] the address.
 * @returns {IAccountInformation | null} the account information for the supplied address, the account information for
 * first account in the account list or null.
 */
export default function useSelectAccountInformationByAddress(
  address?: string
): IAccountInformation | null {
  const account: IAccount | null = useSelectAccountByAddress(address);
  const network: INetworkWithTransactionParams | null =
    useSelectSelectedNetwork();

  if (!account || !network) {
    return null;
  }

  return AccountService.extractAccountInformationForNetwork(account, network);
}
