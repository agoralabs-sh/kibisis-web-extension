// Types
import { IAccount } from '@extension/types';

/**
 * Updates the account, if it exists, otherwise it adds the account and returns the update accounts list. This function
 * uses the id as the index.
 * @param {IAccount[]} accounts - a list of accounts.
 * @param {IAccount} account - the account to add or update.
 * @returns {IAccount[]} a new accounts list with the account updated or added.
 */
export default function upsertAccount(
  accounts: IAccount[],
  account: IAccount
): IAccount[] {
  // if the accounts doesn't contain the account by address, just add it
  if (!accounts.find((value) => value.id === account.id)) {
    return [...accounts, account];
  }

  return accounts.map((value) => (value.id === account.id ? account : value));
}
