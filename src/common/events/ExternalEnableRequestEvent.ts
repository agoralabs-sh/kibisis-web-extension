// enums
import { EventNameEnum } from '@common/enums';

// events
import BaseEvent from './BaseEvent';

interface IPayload {
  genesisHash: string | null;
}

export default class ExternalEnableRequestEvent extends BaseEvent {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(EventNameEnum.ExternalEnableRequest);

    this.payload = payload;
  }
}
