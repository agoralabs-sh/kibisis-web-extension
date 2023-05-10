import { BigNumber } from 'bignumber.js';

// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Types
import {
  IBaseTransaction,
  IAlgorandPaymentTransaction,
  IPaymentTransaction,
} from '@extension/types';

export default function parsePaymentTransaction(
  algorandPaymentTransaction: IAlgorandPaymentTransaction,
  baseTransaction: IBaseTransaction
): IPaymentTransaction {
  return {
    ...baseTransaction,
    amount: new BigNumber(
      String(algorandPaymentTransaction.amount as bigint)
    ).toString(),
    receiver: algorandPaymentTransaction.receiver,
    type: TransactionTypeEnum.Payment,
  };
}
