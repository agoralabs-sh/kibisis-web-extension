// enums
import { EventTypeEnum } from '@extension/enums';

// types
import type IBaseEvent from './IBaseEvent';
import type ISendKeyRegistrationTransactionEventPayload from './ISendKeyRegistrationTransactionEventPayload';

interface ISendKeyRegistrationTransactionEvent
  extends IBaseEvent<ISendKeyRegistrationTransactionEventPayload> {
  type: EventTypeEnum.SendKeyRegistrationTransaction;
}

export default ISendKeyRegistrationTransactionEvent;
