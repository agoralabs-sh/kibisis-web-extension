import type { IARC0001Transaction } from '@agoralabs-sh/avm-web-provider';

// types
import type { IBaseOptions } from '@common/types';
import type { IAccountWithExtendedProps, INetwork } from '@extension/types';

/**
 * @property {IAccountWithExtendedProps[]} accounts - the authorized accounts.
 * @property {IAccountWithExtendedProps[]} authAccounts - [optional] a list of auth accounts that can sign the transaction for
 * re-keyed accounts.
 * @property {IARC0001Transaction[]} arc0001Transactions - the transactions to be signed.
 * @property {string} password - the password that was used to encrypt the private key.
 */
interface IOptions extends IBaseOptions {
  accounts: IAccountWithExtendedProps[];
  arc0001Transactions: IARC0001Transaction[];
  authAccounts: IAccountWithExtendedProps[];
  networks: INetwork[];
  password: string;
}

export default IOptions;
