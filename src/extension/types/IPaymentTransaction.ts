// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import IBaseTransaction from './IBaseTransaction';

interface IPaymentTransaction extends IBaseTransaction {
  amount: string;
  receiver: string;
  type: TransactionTypeEnum.Payment;
}

export default IPaymentTransaction;
