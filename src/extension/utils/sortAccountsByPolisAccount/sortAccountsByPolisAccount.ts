// types
import type { IAccount } from '@extension/types';
import type { IOptions } from './types';

// utils
import serialize from '@extension/utils/serialize';

/**
 * Convenience function that "sorts" a list of accounts by moving the polis account to the front. This uses a splice
 * rather than a sort for efficiency reasons. If no polis account is found, the accounts remain unchanged.
 * @param {IOptions<Type extends IAccount>} options - a list of accounts and the polis account ID.
 * @returns {Type extends IAccount} the list of accounts with the polis account at the front.
 */
export default function sortAccountsByPolisAccount<Type extends IAccount>({
  accounts,
  polisAccountID,
}: IOptions<Type>): Type[] {
  const _accounts = serialize(accounts);
  const index = accounts.findIndex(({ id }) => id === polisAccountID);

  if (index < 0) {
    return _accounts;
  }

  return [..._accounts.splice(index, 1), ..._accounts];
}
