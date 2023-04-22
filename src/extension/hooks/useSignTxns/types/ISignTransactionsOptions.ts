import { IWalletTransaction } from '@agoralabs-sh/algorand-provider';

/**
 * @property {string[]} authorizedAddresses - the authorized addresses.
 * @property {string} password - the password that was used to encrypt the private key of the addresses.
 * @property {IWalletTransaction[]} transactions - the transactions to be signed.
 */
interface ISignTransactionsOptions {
  authorizedAddresses: string[];
  password: string;
  transactions: IWalletTransaction[];
}

export default ISignTransactionsOptions;
