// enums
import { EventTypeEnum } from '@extension/enums';

// events
import BaseEvent from './BaseEvent';

// types
import type {
  IARC0300KeyRegistrationTransactionSendEvent,
  IARC0300OfflineKeyRegistrationTransactionSendSchema,
  IARC0300OnlineKeyRegistrationTransactionSendSchema,
} from '@extension/types';

export interface INewOptions {
  id: string;
  payload:
    | IARC0300OfflineKeyRegistrationTransactionSendSchema
    | IARC0300OnlineKeyRegistrationTransactionSendSchema;
}

export default class ARC0300KeyRegistrationTransactionSendEvent
  extends BaseEvent<
    | IARC0300OfflineKeyRegistrationTransactionSendSchema
    | IARC0300OnlineKeyRegistrationTransactionSendSchema
  >
  implements IARC0300KeyRegistrationTransactionSendEvent
{
  public type: EventTypeEnum.ARC0300KeyRegistrationTransactionSend;

  constructor({ id, payload }: INewOptions) {
    super();

    this.id = id;
    this.payload = payload;
    this.type = EventTypeEnum.ARC0300KeyRegistrationTransactionSend;
  }
}
