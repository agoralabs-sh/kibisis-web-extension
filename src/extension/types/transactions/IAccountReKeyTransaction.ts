// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import type IBaseTransaction from './IBaseTransaction';

interface IAccountReKeyTransaction extends IBaseTransaction {
  amount: string;
  receiver: string;
  type: TransactionTypeEnum.AccountReKey;
}

export default IAccountReKeyTransaction;
