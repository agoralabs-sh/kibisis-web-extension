// enums
import { EventNameEnum } from '@common/enums';

// events
import { BaseEvent } from '@common/events';

interface IPayload {
  eventId: string;
}

export default class ExtensionBackgroundAppLoadEvent extends BaseEvent {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(EventNameEnum.ExtensionBackgroundAppLoad);

    this.payload = payload;
  }
}
