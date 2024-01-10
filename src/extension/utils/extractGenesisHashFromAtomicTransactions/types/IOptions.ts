// types
import type { IArc0001SignTxns, IBaseOptions } from '@common/types';

/**
 * @property {IArc0001SignTxns[]} txns - a group of atomic transactions.
 */
interface IOptions extends IBaseOptions {
  txns: IArc0001SignTxns[];
}

export default IOptions;
