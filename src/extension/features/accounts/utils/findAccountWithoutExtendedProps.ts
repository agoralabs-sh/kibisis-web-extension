// types
import type { IAccount, IAccountWithExtendedProps } from '@extension/types';

// utils
import mapAccountWithExtendedPropsToAccount from '@extension/utils/mapAccountWithExtendedPropsToAccount';

/**
 * Convenience function that finds the account, by its ID, amongst an array of accounts with extended props. This
 * function omits the extended props from the result.
 * @param {string} accountId - the account ID.
 * @param {IAccountWithExtendedProps[]} accounts - a list of accounts with extended props.
 * @returns {IAccount | null} the account or null if it doesn't exist in the list of results.
 */
export default function findAccountWithoutExtendedProps(
  accountId: string,
  accounts: IAccountWithExtendedProps[]
): IAccount | null {
  const accountWithExtendedProps =
    accounts.find((value) => value.id === accountId) || null;

  if (!accountWithExtendedProps) {
    return null;
  }

  return mapAccountWithExtendedPropsToAccount(accountWithExtendedProps);
}
