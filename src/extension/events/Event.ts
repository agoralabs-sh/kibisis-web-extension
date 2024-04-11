// enums
import { EventTypeEnum } from '@extension/enums';

// types
import type { IEvent, TEventPayloads } from '@extension/types';

export default class Event<Payload = TEventPayloads>
  implements IEvent<Payload>
{
  public readonly id: string;
  public readonly payload: Payload;
  public readonly type: EventTypeEnum;

  constructor({ id, payload, type }: IEvent<Payload>) {
    this.id = id;
    this.payload = payload;
    this.type = type;
  }
}
