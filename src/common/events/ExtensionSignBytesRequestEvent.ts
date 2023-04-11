// Enums
import { EventNameEnum } from '@common/enums';

// Events
import BaseEvent from './BaseEvent';

// Types
import { IExtensionSignBytesRequestPayload } from '@common/types';

type IPayload = IExtensionSignBytesRequestPayload;

export default class ExtensionSignBytesRequestEvent extends BaseEvent {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(EventNameEnum.ExtensionSignBytesRequest);

    this.payload = payload;
  }
}
