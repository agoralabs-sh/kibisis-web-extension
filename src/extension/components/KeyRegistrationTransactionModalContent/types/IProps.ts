import { Transaction } from 'algosdk';

// types
import type {
  IAccount,
  ICondensedProps,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IProps {
  account: IAccount;
  condensed?: ICondensedProps;
  network: INetworkWithTransactionParams;
  showHeader?: boolean;
  transaction: Transaction;
}

export default IProps;
