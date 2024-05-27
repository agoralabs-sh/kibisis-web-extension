// types
import type {
  IAccountWithExtendedProps,
  INetwork,
  ITransactions,
} from '@extension/types';

interface IProps<Transaction = ITransactions> {
  account: IAccountWithExtendedProps;
  accounts: IAccountWithExtendedProps[];
  network: INetwork;
  transaction: Transaction;
}

export default IProps;
