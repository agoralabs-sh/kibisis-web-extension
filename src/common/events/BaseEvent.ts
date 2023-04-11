// Enums
import { EventNameEnum } from '@common/enums';

export default class BaseEvent {
  public readonly event: EventNameEnum;

  constructor(event: EventNameEnum) {
    this.event = event;
  }
}
