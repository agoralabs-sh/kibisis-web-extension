// Types
import { IAccount } from '../../../types';

/**
 @property {boolean} fetching - true when accounts are being fetched from storage or remote account information is
 being fetched.
 * @property {IAccount[]} items - the account items.
 * @property {boolean} saving - true when the account is being saved to storage.
 */
interface IAccountsState {
  fetching: boolean;
  items: IAccount[];
  saving: boolean;
}

export default IAccountsState;
