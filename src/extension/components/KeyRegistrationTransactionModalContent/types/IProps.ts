import { Transaction } from 'algosdk';

// types
import type { IAccount, ICondensedProps, INetwork } from '@extension/types';

interface IProps {
  account: IAccount | null;
  condensed?: ICondensedProps;
  network: INetwork;
  showHeader?: boolean;
  transaction: Transaction;
}

export default IProps;
