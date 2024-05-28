import type { Transaction } from 'algosdk';

// types
import type {
  IAccount,
  ICondensedProps,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IProps {
  account: IAccount;
  accounts: IAccount[];
  condensed?: ICondensedProps;
  hideNetwork?: boolean;
  network: INetworkWithTransactionParams;
  showHeader?: boolean;
  transaction: Transaction;
}

export default IProps;
