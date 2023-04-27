// Types
import { IAccount } from '@extension/types';

/**
 * @property {boolean} fetching - true when accounts are being fetched from storage.
 * @property {IAccount[]} items - all accounts
 * @property {number | null} pollingId - id of the polling interval.
 * @property {boolean} saving - true when the account is being saved to storage.
 * @property {boolean} updating - true when remote account information is being updated.
 */
interface IAccountsState {
  fetching: boolean;
  items: IAccount[];
  pollingId: number | null;
  saving: boolean;
  updating: boolean;
}

export default IAccountsState;
