// Types
import { IAccount } from '../../../types';
import ISignDataRequest from './ISignDataRequest';

/**
 * @property {IAccount[]} items - the account items.
 * @property {boolean} fetching - true when accounts are being fetched from storage or remote account information is
 * being fetched.
 * @property {ISignDataRequest | null} signDataRequest -  a sign data request sent from the web page.
 */
interface IAccountsState {
  fetching: boolean;
  items: IAccount[];
  signDataRequest: ISignDataRequest | null;
}

export default IAccountsState;
