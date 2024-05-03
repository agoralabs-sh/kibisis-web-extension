// enums
import { ARC0300AuthorityEnum, ARC0300PathEnum } from '@extension/enums';

// types
import type IARC0300BaseSchema from './IARC0300BaseSchema';
import type IARC0300OfflineKeyRegistrationTransactionSendQuery from './IARC0300OfflineKeyRegistrationTransactionSendQuery';

interface IARC0300OnlineKeyRegistrationTransactionSendSchema
  extends IARC0300BaseSchema<IARC0300OfflineKeyRegistrationTransactionSendQuery> {
  authority: ARC0300AuthorityEnum.Transaction;
  paths: [ARC0300PathEnum.Send];
}

export default IARC0300OnlineKeyRegistrationTransactionSendSchema;
