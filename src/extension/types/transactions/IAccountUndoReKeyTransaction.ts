// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import type IBaseTransaction from './IBaseTransaction';

interface IAccountUndoReKeyTransaction extends IBaseTransaction {
  amount: string;
  receiver: string;
  type: TransactionTypeEnum.AccountUndoReKey;
}

export default IAccountUndoReKeyTransaction;
