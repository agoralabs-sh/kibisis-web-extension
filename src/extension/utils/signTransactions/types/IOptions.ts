import type { IARC0001Transaction } from '@agoralabs-sh/avm-web-provider';

// types
import type { IBaseOptions } from '@common/types';

/**
 * @property {string[]} authorizedSigners - the authorized signers
 * @property {string} password - the password that was used to encrypt the private key.
 * @property {IARC0001Transaction[]} txns - the transactions to be signed.
 */
interface IOptions extends IBaseOptions {
  authorizedSigners: string[];
  password: string;
  txns: IARC0001Transaction[];
}

export default IOptions;
