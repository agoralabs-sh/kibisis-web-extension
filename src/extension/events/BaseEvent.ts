// enums
import { EventTypeEnum } from '@extension/enums';

// types
import type { IBaseEvent } from '@extension/types';

export default class BaseEvent<Payload> implements IBaseEvent<Payload> {
  public id: string;
  public payload: Payload;
  public type: EventTypeEnum;
}
