// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import IApplicationTransaction from './IApplicationTransaction';

/**
 *
 */
interface IARC0200TransferTransaction extends IApplicationTransaction {
  amount: string;
  receiver: string;
  type: TransactionTypeEnum.ARC0200Transfer;
}

export default IARC0200TransferTransaction;
