// Types
import { IAccount } from '../../../types';

/**
 * @property {IAccount[]} items - the account items.
 * @property {boolean} fetching - true when accounts are being fetched from storage or remote account information is
 * being fetched.
 */
interface IAccountsState {
  fetching: boolean;
  items: IAccount[];
}

export default IAccountsState;
