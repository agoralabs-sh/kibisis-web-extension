// Enums
import { EventNameEnum } from '@common/enums';

// Events
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
