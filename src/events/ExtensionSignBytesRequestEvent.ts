// Enums
import { EventNameEnum } from '../enums';

// Events
import BaseEvent from './BaseEvent';

// Types
import { IExtensionSignBytesRequestPayload } from '../types';

type IPayload = IExtensionSignBytesRequestPayload;

export default class ExtensionSignBytesRequestEvent extends BaseEvent {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(EventNameEnum.ExtensionSignBytesRequest);

    this.payload = payload;
  }
}
