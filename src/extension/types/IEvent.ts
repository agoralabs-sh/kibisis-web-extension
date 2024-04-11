// enums
import { EventTypeEnum } from '@extension/enums';

// types
import type TEventPayloads from './TEventPayloads';

interface IEvent<Payload = TEventPayloads> {
  id: string;
  payload: Payload;
  type: EventTypeEnum;
}

export default IEvent;
