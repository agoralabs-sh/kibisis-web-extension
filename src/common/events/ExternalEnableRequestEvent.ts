// Enums
import { EventNameEnum } from '@common/enums';

// Events
import BaseEvent from './BaseEvent';

// Types
import { IBaseEnableRequestPayload } from '@common/types';

type IPayload = IBaseEnableRequestPayload;

export default class ExternalEnableRequestEvent extends BaseEvent {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(EventNameEnum.ExternalEnableRequest);

    this.payload = payload;
  }
}
