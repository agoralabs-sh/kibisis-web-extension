import type {
  IAccountGroup,
  IAccountWithExtendedProps,
  IActiveAccountDetails,
} from '@extension/types';

/**
 * @property {IAccount[]} accounts - All the accounts stored in storage.
 * @property {IActiveAccountDetails | null} activeAccountDetails - The details of the saved active account.
 * @property {IAccountGroup[]} groups - All account groups in storage.
 */
interface IFetchAccountsFromStorageResult {
  accounts: IAccountWithExtendedProps[];
  activeAccountDetails: IActiveAccountDetails | null;
  groups: IAccountGroup[];
}

export default IFetchAccountsFromStorageResult;
