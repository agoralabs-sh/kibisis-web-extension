// types
import { IAccount, INetwork, ITransactions } from '@extension/types';

interface IUseTransactionPageState {
  account: IAccount | null;
  network: INetwork | null;
  transaction: ITransactions | null;
}

export default IUseTransactionPageState;
