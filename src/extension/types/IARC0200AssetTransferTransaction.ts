// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import IApplicationTransaction from './IApplicationTransaction';

interface IARC0200AssetTransferTransaction extends IApplicationTransaction {
  amount: string;
  receiver: string;
  type: TransactionTypeEnum.ARC0200AssetTransfer;
}

export default IARC0200AssetTransferTransaction;
