// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import IBaseTransaction from './IBaseTransaction';

interface IUnknownTransaction extends IBaseTransaction {
  type: TransactionTypeEnum.Unknown;
}

export default IUnknownTransaction;
