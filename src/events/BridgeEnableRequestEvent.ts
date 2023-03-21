import { IEnableOptions } from '@agoralabs-sh/algorand-provider';

// Enums
import { EventNameEnum } from '../enums';

// Events
import BaseEvent from './BaseEvent';

// Types
import { IBaseEnableRequestPayload } from '../types';

interface IPayload extends IBaseEnableRequestPayload {
  host: string;
  iconUrl: string | null;
}

export default class BridgeEnableRequestEvent extends BaseEvent {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(EventNameEnum.BridgeEnableRequest);

    this.payload = payload;
  }
}
