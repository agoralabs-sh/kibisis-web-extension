import type { Transaction } from 'algosdk';

// types
import {
  IAccountWithExtendedProps,
  IAssetTypes,
  INativeCurrency,
  INetworkWithTransactionParams,
} from '@extension/types';

interface SendAssetModalSummaryContentProps {
  accounts: IAccountWithExtendedProps[];
  amountInStandardUnits: string;
  asset: IAssetTypes | INativeCurrency;
  fromAccount: IAccountWithExtendedProps;
  network: INetworkWithTransactionParams;
  note: string | null;
  toAddress: string;
  transactions: Transaction[];
}

export default SendAssetModalSummaryContentProps;
