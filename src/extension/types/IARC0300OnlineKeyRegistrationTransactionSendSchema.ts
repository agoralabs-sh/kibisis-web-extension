// enums
import { ARC0300AuthorityEnum, ARC0300PathEnum } from '@extension/enums';

// types
import type IARC0300BaseSchema from './IARC0300BaseSchema';
import type IARC0300OnlineKeyRegistrationTransactionSendQuery from './IARC0300OnlineKeyRegistrationTransactionSendQuery';

interface IARC0300OnlineKeyRegistrationTransactionSendSchema
  extends IARC0300BaseSchema<IARC0300OnlineKeyRegistrationTransactionSendQuery> {
  authority: ARC0300AuthorityEnum.Transaction;
  paths: [ARC0300PathEnum.Send];
}

export default IARC0300OnlineKeyRegistrationTransactionSendSchema;
