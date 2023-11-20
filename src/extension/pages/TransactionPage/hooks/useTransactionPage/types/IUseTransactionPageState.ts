// types
import {
  IAccount,
  IAccountInformation,
  INetwork,
  ITransactions,
} from '@extension/types';

interface IUseTransactionPageState {
  account: IAccount | null;
  accountInformation: IAccountInformation | null;
  network: INetwork | null;
  transaction: ITransactions | null;
}

export default IUseTransactionPageState;
