import type { Transaction } from 'algosdk';

// models
import BaseBlockExplorer from '@extension/models/BaseBlockExplorer';

// types
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
} from '@extension/types';
import type ICondensedProps from './ICondensedProps';

interface ITransactionBodyProps {
  accounts: IAccountWithExtendedProps[];
  blockExplorer: BaseBlockExplorer | null;
  condensed?: ICondensedProps;
  fromAccount: IAccountWithExtendedProps | null;
  hideNetwork?: boolean;
  loading?: boolean;
  network: INetworkWithTransactionParams;
  transaction: Transaction;
}

export default ITransactionBodyProps;
