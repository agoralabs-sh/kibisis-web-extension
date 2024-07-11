import type { IARC0001Transaction } from '@agoralabs-sh/avm-web-provider';

// types
import type { IBaseOptions } from '@common/types';
import type {
  IAccountWithExtendedProps,
  INetwork,
  TEncryptionCredentials,
} from '@extension/types';

/**
 * @property {IAccountWithExtendedProps[]} accounts - the authorized accounts.
 * @property {IAccountWithExtendedProps[]} authAccounts - [optional] a list of auth accounts that can sign the transaction for
 * re-keyed accounts.
 * @property {IARC0001Transaction[]} arc0001Transactions - the transactions to be signed.
 */
interface IOptions extends IBaseOptions {
  accounts: IAccountWithExtendedProps[];
  arc0001Transactions: IARC0001Transaction[];
  authAccounts: IAccountWithExtendedProps[];
  networks: INetwork[];
}

type TOptions = IOptions & TEncryptionCredentials;

export default TOptions;
