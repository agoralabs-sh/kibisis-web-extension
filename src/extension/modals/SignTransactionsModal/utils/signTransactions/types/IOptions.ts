import type { IARC0001Transaction } from '@agoralabs-sh/avm-web-provider';

// types
import type { IBaseOptions } from '@common/types';
import type { IAccountWithExtendedProps, INetwork } from '@extension/types';

/**
 * @property {IARC0001Transaction[]} arc001Transactions - the transactions to be signed.
 * @property {IAccountWithExtendedProps[]} authorizedAccounts - the authorized accounts.
 * @property {string} password - the password that was used to encrypt the private key.
 */
interface IOptions extends IBaseOptions {
  arc001Transactions: IARC0001Transaction[];
  authorizedAccounts: IAccountWithExtendedProps[];
  networks: INetwork[];
  password: string;
}

export default IOptions;
