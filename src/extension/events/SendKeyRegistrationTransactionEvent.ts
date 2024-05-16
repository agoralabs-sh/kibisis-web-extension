// enums
import { EventTypeEnum } from '@extension/enums';

// events
import BaseEvent from './BaseEvent';

// types
import type {
  ISendKeyRegistrationTransactionEvent,
  ISendKeyRegistrationTransactionEventPayload,
} from '@extension/types';

export interface INewOptions {
  id: string;
  payload: ISendKeyRegistrationTransactionEventPayload;
}

export default class SendKeyRegistrationTransactionEvent
  extends BaseEvent<ISendKeyRegistrationTransactionEventPayload>
  implements ISendKeyRegistrationTransactionEvent
{
  public type: EventTypeEnum.SendKeyRegistrationTransaction;

  constructor({ id, payload }: INewOptions) {
    super();

    this.id = id;
    this.payload = payload;
    this.type = EventTypeEnum.SendKeyRegistrationTransaction;
  }
}
