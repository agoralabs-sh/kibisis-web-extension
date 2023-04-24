import { OnApplicationComplete, Transaction } from 'algosdk';

// Enums
import { TransactionTypeEnum } from '@extension/enums';

export default function parseTransactionType(
  transaction: Transaction
): TransactionTypeEnum {
  if (transaction.type === 'appl') {
    // if there is no app oncomplete, it could be either a noop or creation
    if (!transaction.appOnComplete) {
      // if there is an app index, it will be a no-op
      if (transaction.appIndex) {
        return TransactionTypeEnum.ApplicationNoOp;
      }

      return TransactionTypeEnum.ApplicationCreate;
    }

    // otherwise, just use the application on complete
    switch (transaction.appOnComplete) {
      case OnApplicationComplete.ClearStateOC:
        return TransactionTypeEnum.ApplicationClearState;
      case OnApplicationComplete.CloseOutOC:
        return TransactionTypeEnum.ApplicationCloseOut;
      case OnApplicationComplete.DeleteApplicationOC:
        return TransactionTypeEnum.ApplicationDelete;
      case OnApplicationComplete.OptInOC:
        return TransactionTypeEnum.ApplicationOptIn;
      case OnApplicationComplete.UpdateApplicationOC:
        return TransactionTypeEnum.ApplicationUpdate;
      default:
        return TransactionTypeEnum.Unknown;
    }
  }

  if (transaction.type === 'axfer') {
    return TransactionTypeEnum.AssetTransfer;
  }

  if (transaction.type === 'pay') {
    return TransactionTypeEnum.Payment;
  }

  return TransactionTypeEnum.Unknown;
}
