// types
import type { IAccountWithExtendedProps, INetwork } from '@extension/types';

interface IProps<Transaction> {
  account: IAccountWithExtendedProps;
  accounts: IAccountWithExtendedProps[];
  network: INetwork;
  transaction: Transaction;
}

export default IProps;
