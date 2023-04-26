import { v4 as uuid } from 'uuid';

// Enums
import { EventNameEnum } from '@common/enums';

export default class BaseEvent {
  public readonly event: EventNameEnum;
  public readonly id: string;

  constructor(event: EventNameEnum) {
    this.event = event;
    this.id = uuid();
  }
}
