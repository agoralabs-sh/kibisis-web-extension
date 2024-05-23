// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import type IBaseTransaction from './IBaseTransaction';

interface IKeyRegistrationOnlineTransaction extends IBaseTransaction {
  selectionParticipationKey: string;
  type: TransactionTypeEnum.KeyRegistrationOnline;
  voteFirstValid: string;
  voteKeyDilution: string;
  voteLastValid: string;
  voteParticipationKey: string;
}

export default IKeyRegistrationOnlineTransaction;
