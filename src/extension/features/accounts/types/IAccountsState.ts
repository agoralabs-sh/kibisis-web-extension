// types
import { IAccount } from '@extension/types';

/**
 * @property {boolean} fetching - true when fetching accounts from storage.
 * @property {IAccount[]} items - all accounts
 * @property {number | null} pollingId - id of the polling interval.
 * @property {boolean} saving - true when the account is being saved to storage.
 * @property {boolean} updatingInformation - true when updating account information from the network.
 * @property {boolean} updatingTransactions - true when updating transactions from the network.
 */
interface IAccountsState {
  fetching: boolean;
  items: IAccount[];
  pollingId: number | null;
  saving: boolean;
  updatingInformation: boolean;
  updatingTransactions: boolean;
}

export default IAccountsState;
