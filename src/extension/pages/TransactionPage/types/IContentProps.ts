// types
import type { IAccount, INetwork } from '@extension/types';

interface IContentProps<Transaction> {
  account: IAccount;
  network: INetwork;
  transaction: Transaction;
}

export default IContentProps;
