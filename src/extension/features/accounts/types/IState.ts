// types
import type {
  IAccountWithExtendedProps,
  IActiveAccountDetails,
} from '@extension/types';
import type IAccountUpdate from './IAccountUpdate';

/**
 * @property {IActiveAccountDetails | null} activeAccountDetails - details of the active account.
 * @property {boolean} fetching - true when fetching accounts from storage.
 * @property {IAccount[]} items - all accounts
 * @property {number | null} pollingId - id of the polling interval.
 * @property {boolean} saving - true when the account is being saved to storage.
 * @property {IAccountUpdate[]} updatingAccounts - a list of accounts being updated.
 */
interface IState {
  activeAccountDetails: IActiveAccountDetails | null;
  fetching: boolean;
  items: IAccountWithExtendedProps[];
  pollingId: number | null;
  saving: boolean;
  updatingAccounts: IAccountUpdate[];
}

export default IState;
