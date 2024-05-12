import type {
  IAccountWithExtendedProps,
  IActiveAccountDetails,
} from '@extension/types';

/**
 * @property {IAccount[]} accounts - all the accounts stored in storage.
 * @property {IActiveAccountDetails | null} activeAccountDetails - the details of the saved active account.
 */
interface IFetchAccountsFromStorageResult {
  accounts: IAccountWithExtendedProps[];
  activeAccountDetails: IActiveAccountDetails | null;
}

export default IFetchAccountsFromStorageResult;
