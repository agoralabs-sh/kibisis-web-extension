// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Types
import IBaseTransaction from './IBaseTransaction';

interface IUnknownTransaction extends IBaseTransaction {
  type: TransactionTypeEnum.Unknown;
}

export default IUnknownTransaction;
