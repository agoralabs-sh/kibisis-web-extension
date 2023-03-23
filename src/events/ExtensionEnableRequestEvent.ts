// Enums
import { EventNameEnum } from '../enums';

// Events
import BaseEvent from './BaseEvent';

// Types
import { IBaseEnableRequestPayload } from '../types';

interface IPayload extends IBaseEnableRequestPayload {
  appName: string;
  host: string;
  iconUrl: string | null;
}

export default class ExtensionEnableRequestEvent extends BaseEvent {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(EventNameEnum.ExtensionEnableRequest);

    this.payload = payload;
  }
}
