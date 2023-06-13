// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Types
import IBaseTransaction from './IBaseTransaction';

interface IPaymentTransaction extends IBaseTransaction {
  amount: string;
  receiver: string;
  type: TransactionTypeEnum.Payment;
}

export default IPaymentTransaction;
