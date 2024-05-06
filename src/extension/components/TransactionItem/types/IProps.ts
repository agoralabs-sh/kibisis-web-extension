import { IAccount, INetwork, ITransactions } from '@extension/types';

interface IProps<Transaction = ITransactions> {
  account: IAccount;
  network: INetwork;
  transaction: Transaction;
}

export default IProps;
