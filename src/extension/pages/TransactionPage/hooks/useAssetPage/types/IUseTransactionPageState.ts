// Types
import { IAccount, IAccountInformation, ITransactions } from '@extension/types';

interface IUseTransactionPageState {
  account: IAccount | null;
  accountInformation: IAccountInformation | null;
  transaction: ITransactions | null;
}

export default IUseTransactionPageState;
