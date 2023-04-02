// Enums
import { EventNameEnum } from '../enums';

// Events
import BaseEvent from './BaseEvent';

// Types
import { IBaseSignBytesRequestPayload } from '../types';

type IPayload = IBaseSignBytesRequestPayload;

export default class ExternalSignBytesRequestEvent extends BaseEvent {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(EventNameEnum.ExternalSignBytesRequest);

    this.payload = payload;
  }
}
