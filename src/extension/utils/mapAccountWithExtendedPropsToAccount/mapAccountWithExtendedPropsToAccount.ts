//
import type { IAccount, IAccountWithExtendedProps } from '@extension/types';

/**
 * Convenience function that simply converts an account with extended props object to an account object that is used in
 * storage. It omits the unused props.
 * @param {IAccountWithExtendedProps} accountWithExtendedProps - an account object with extended props.
 * @returns {IAccount} the account object without the extended props.
 */
export default function mapAccountWithExtendedPropsToAccount({
  createdAt,
  id,
  name,
  networkInformation,
  networkTransactions,
  publicKey,
  updatedAt,
}: IAccountWithExtendedProps): IAccount {
  return {
    createdAt,
    id,
    name,
    networkInformation,
    networkTransactions,
    publicKey,
    updatedAt,
  };
}
