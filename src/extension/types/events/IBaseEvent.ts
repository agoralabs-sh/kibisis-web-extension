// enums
import { EventTypeEnum } from '@extension/enums';

interface IBaseEvent<Payload> {
  id: string;
  payload: Payload;
  type: EventTypeEnum;
}

export default IBaseEvent;
