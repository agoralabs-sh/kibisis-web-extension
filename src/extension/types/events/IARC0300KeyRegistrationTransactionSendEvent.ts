// enums
import { EventTypeEnum } from '@extension/enums';

// types
import type {
  IARC0300OfflineKeyRegistrationTransactionSendSchema,
  IARC0300OnlineKeyRegistrationTransactionSendSchema,
} from '@extension/types';
import type IBaseEvent from './IBaseEvent';

interface IARC0300KeyRegistrationTransactionSendEvent
  extends IBaseEvent<
    | IARC0300OfflineKeyRegistrationTransactionSendSchema
    | IARC0300OnlineKeyRegistrationTransactionSendSchema
  > {
  type: EventTypeEnum.ARC0300KeyRegistrationTransactionSend;
}

export default IARC0300KeyRegistrationTransactionSendEvent;
