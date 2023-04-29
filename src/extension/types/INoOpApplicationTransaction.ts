// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Types
import IBaseTransaction from './IBaseTransaction';

interface INoOpApplicationTransaction extends IBaseTransaction {
  applicationId: string;
  type: TransactionTypeEnum.ApplicationNoOp;
}

export default INoOpApplicationTransaction;
