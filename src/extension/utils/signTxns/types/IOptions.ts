// types
import type { IARC0001SignTxns, IBaseOptions } from '@common/types';

/**
 * @property {string[]} authorizedSigners - the authorized signers
 * @property {string} password - the password that was used to encrypt the private key.
 * @property {IARC0001SignTxns} txns - the transactions to be signed.
 */
interface IOptions extends IBaseOptions {
  authorizedSigners: string[];
  password: string;
  txns: IARC0001SignTxns[];
}

export default IOptions;
