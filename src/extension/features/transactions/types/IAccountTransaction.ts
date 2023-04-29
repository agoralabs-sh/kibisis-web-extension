// Types
import { ITransactions } from '@extension/types';

/**
 * @property {string} accountId - the account ID.
 * @property {boolean} fetching - whether this account is currently fetching data.
 * @property {string | null} next - the token for the next page of results.
 * @property {ITransactions[]} transactions - a list of transactions.
 */
interface IAccountTransaction {
  accountId: string;
  fetching: boolean;
  next: string | null;
  transactions: ITransactions[];
}

export default IAccountTransaction;
