// enums
import { EventTypeEnum } from '@extension/enums';

// types
import IEnableEventPayload from './IEnableEventPayload';
import ISignBytesEventPayload from './ISignBytesEventPayload';
import ISignTxnsEventPayload from './ISignTxnsEventPayload';

interface IEvent<
  Payload = IEnableEventPayload | ISignBytesEventPayload | ISignTxnsEventPayload
> {
  id: string;
  originTabId: number;
  payload: Payload;
  type: EventTypeEnum;
}

export default IEvent;
