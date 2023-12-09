// types
import { IAccount } from '@extension/types';
import IAccountUpdate from './IAccountUpdate';

/**
 * @property {boolean} fetching - true when fetching accounts from storage.
 * @property {IAccount[]} items - all accounts
 * @property {number | null} pollingId - id of the polling interval.
 * @property {boolean} saving - true when the account is being saved to storage.
 * @property {IAccountUpdate[]} updatingAccounts - a list of accounts being updated.
 */
interface IAccountsState {
  fetching: boolean;
  items: IAccount[];
  pollingId: number | null;
  saving: boolean;
  updatingAccounts: IAccountUpdate[];
}

export default IAccountsState;
