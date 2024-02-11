import { Transaction } from 'algosdk';

// types
import type { IBaseOptions } from '@common/types';

/**
 * @property {Transaction[]} txns - a group of atomic transactions.
 */
interface IOptions extends IBaseOptions {
  transactions: Transaction[];
}

export default IOptions;
