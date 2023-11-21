// types
import IAccountTransaction from './IAccountTransaction';

/**
 * @property {IAccountTransaction[]} items - the account transactions.
 */
interface ITransactionsState {
  items: IAccountTransaction[];
}

export default ITransactionsState;
