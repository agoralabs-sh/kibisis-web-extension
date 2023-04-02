// Enums
import { EventNameEnum } from '../enums';

// Events
import BaseEvent from './BaseEvent';

// Types
import { IBaseSignDataRequestPayload } from '../types';

type IPayload = IBaseSignDataRequestPayload;

export default class ExternalSignDataRequestEvent extends BaseEvent {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(EventNameEnum.ExtensionSignDataRequest);

    this.payload = payload;
  }
}
