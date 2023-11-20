// enums
import { TransactionTypeEnum } from '@extension/enums';

type IApplicationTransactionTypes =
  | TransactionTypeEnum.ApplicationClearState
  | TransactionTypeEnum.ApplicationCloseOut
  | TransactionTypeEnum.ApplicationCreate
  | TransactionTypeEnum.ApplicationDelete
  | TransactionTypeEnum.ApplicationNoOp
  | TransactionTypeEnum.ApplicationOptIn
  | TransactionTypeEnum.ApplicationUpdate;

export default IApplicationTransactionTypes;
