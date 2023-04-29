// Types
import { ITransaction } from '@extension/types';

/**
 * @property {string} accountId - the account ID.
 * @property {string | null} next - the token for the next page of results.
 * @property {ITransactions[]} transactions - a list of transactions.
 */
interface IUpdateAccountTransactionsResult {
  accountId: string;
  next: string | null;
  transactions: ITransaction[];
}

export default IUpdateAccountTransactionsResult;
