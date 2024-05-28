import type { Transaction } from 'algosdk';

// types
import type {
  IAccountWithExtendedProps,
  IBlockExplorer,
  INetworkWithTransactionParams,
} from '@extension/types';
import type ICondensedProps from './ICondensedProps';

interface ITransactionBodyProps {
  accounts: IAccountWithExtendedProps[];
  blockExplorer: IBlockExplorer | null;
  condensed?: ICondensedProps;
  fromAccount: IAccountWithExtendedProps | null;
  hideNetwork?: boolean;
  loading?: boolean;
  network: INetworkWithTransactionParams;
  transaction: Transaction;
}

export default ITransactionBodyProps;
