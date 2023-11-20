import { BigNumber } from 'bignumber.js';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
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
