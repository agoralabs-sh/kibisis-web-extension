// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Types
import IBaseTransaction from './IBaseTransaction';

interface IKeyRegistrationOfflineTransaction extends IBaseTransaction {
  type: TransactionTypeEnum.KeyRegistrationOffline;
}

export default IKeyRegistrationOfflineTransaction;
