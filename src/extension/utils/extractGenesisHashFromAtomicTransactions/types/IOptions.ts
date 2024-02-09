// types
import type { IARC0001SignTxns, IBaseOptions } from '@common/types';

/**
 * @property {IARC0001SignTxns[]} txns - a group of atomic transactions.
 */
interface IOptions extends IBaseOptions {
  txns: IARC0001SignTxns[];
}

export default IOptions;
