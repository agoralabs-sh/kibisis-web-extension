import type { Transaction } from 'algosdk';

// types
import {
  IAccount,
  IAssetTypes,
  INativeCurrency,
  INetworkWithTransactionParams,
} from '@extension/types';

interface SendAssetModalSummaryContentProps {
  amountInStandardUnits: string;
  asset: IAssetTypes | INativeCurrency;
  fromAccount: IAccount;
  network: INetworkWithTransactionParams;
  note: string | null;
  toAddress: string;
  transactions: Transaction[];
}

export default SendAssetModalSummaryContentProps;
