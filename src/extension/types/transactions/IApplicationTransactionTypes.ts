// enums
import { TransactionTypeEnum } from '@extension/enums';

type IApplicationTransactionTypes =
  | TransactionTypeEnum.ApplicationClearState
  | TransactionTypeEnum.ApplicationCloseOut
  | TransactionTypeEnum.ApplicationCreate
  | TransactionTypeEnum.ApplicationDelete
  | TransactionTypeEnum.ApplicationNoOp
  | TransactionTypeEnum.ApplicationOptIn
  | TransactionTypeEnum.ApplicationUpdate
  | TransactionTypeEnum.ARC0200AssetTransfer;

export default IApplicationTransactionTypes;
