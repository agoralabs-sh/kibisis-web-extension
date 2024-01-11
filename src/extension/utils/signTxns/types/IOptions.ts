// types
import type { IArc0001SignTxns, IBaseOptions } from '@common/types';

/**
 * @property {string[]} authorizedSigners - the authorized signers
 * @property {string} password - the password that was used to encrypt the private key.
 * @property {IArc0001SignTxns} txns - the transactions to be signed.
 */
interface IOptions extends IBaseOptions {
  authorizedSigners: string[];
  password: string;
  txns: IArc0001SignTxns[];
}

export default IOptions;
