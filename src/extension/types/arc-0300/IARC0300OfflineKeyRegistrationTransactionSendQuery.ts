import { TransactionType } from 'algosdk';

// enums
import { ARC0300QueryEnum } from '@extension/enums';

// types
import type IARC0300CommonTransactionSendQuery from './IARC0300CommonTransactionSendQuery';

interface IARC0300OfflineKeyRegistrationTransactionSendQuery
  extends IARC0300CommonTransactionSendQuery {
  [ARC0300QueryEnum.Type]: TransactionType.keyreg;
}

export default IARC0300OfflineKeyRegistrationTransactionSendQuery;
