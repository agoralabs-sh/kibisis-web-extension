import type { Transaction } from 'algosdk';

// types
import type { IBaseOptions } from '@common/types';
import type {
  IAccountWithExtendedProps,
  INetwork,
  TEncryptionCredentials,
} from '@extension/types';

/**
 * @property {IAccountWithExtendedProps[]} accounts - a list of accounts that can sign the transaction.
 * @property {IAccountWithExtendedProps[]} authAccounts - [optional] a list of auth accounts that can sign the transaction for
 * re-keyed accounts.
 * @property {INetwork[]} networks - a list of networks.
 * @property {algosdk.Transaction} unsignedTransaction - the unsigned transaction.
 */
interface IOptions extends IBaseOptions {
  accounts: IAccountWithExtendedProps[];
  authAccounts: IAccountWithExtendedProps[];
  networks: INetwork[];
  unsignedTransaction: Transaction;
}

type TOptions = IOptions & TEncryptionCredentials;

export default TOptions;
