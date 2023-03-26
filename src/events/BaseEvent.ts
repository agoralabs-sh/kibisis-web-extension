import { EventNameEnum } from '../enums';

export default class BaseEvent {
  public readonly event: EventNameEnum;

  constructor(event: EventNameEnum) {
    this.event = event;
  }
}
