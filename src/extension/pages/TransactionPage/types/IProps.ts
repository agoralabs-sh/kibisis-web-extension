// types
import type { IAccount, INetwork } from '@extension/types';

interface IProps<Transaction> {
  account: IAccount;
  network: INetwork;
  transaction: Transaction;
}

export default IProps;
