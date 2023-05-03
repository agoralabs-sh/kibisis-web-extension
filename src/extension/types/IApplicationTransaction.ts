// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Types
import IBaseTransaction from './IBaseTransaction';

type IApplicationTransactionTypes =
  | TransactionTypeEnum.ApplicationClearState
  | TransactionTypeEnum.ApplicationCloseOut
  | TransactionTypeEnum.ApplicationCreate
  | TransactionTypeEnum.ApplicationDelete
  | TransactionTypeEnum.ApplicationNoOp
  | TransactionTypeEnum.ApplicationOptIn
  | TransactionTypeEnum.ApplicationUpdate;

interface IApplicationTransaction<T = IApplicationTransactionTypes>
  extends IBaseTransaction {
  applicationId: string;
  type: T;
}

export default IApplicationTransaction;
