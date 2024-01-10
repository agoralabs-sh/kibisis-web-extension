// enums
import { EventTypeEnum } from '@extension/enums';

// types
import IClientEventPayload from './IClientEventPayload';

interface IEvent<Payload = IClientEventPayload> {
  id: string;
  payload: Payload;
  type: EventTypeEnum;
}

export default IEvent;
