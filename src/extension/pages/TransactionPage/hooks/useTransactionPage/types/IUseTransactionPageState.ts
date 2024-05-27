// types
import type {
  IAccountWithExtendedProps,
  INetwork,
  ITransactions,
} from '@extension/types';

interface IUseTransactionPageState {
  account: IAccountWithExtendedProps | null;
  accounts: IAccountWithExtendedProps[];
  network: INetwork | null;
  transaction: ITransactions | null;
}

export default IUseTransactionPageState;
