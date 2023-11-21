// enums
import { EventNameEnum } from '@common/enums';

// events
import BaseEvent from './BaseEvent';

// types
import { IExtensionSignBytesRequestPayload } from '@common/types';

type IPayload = IExtensionSignBytesRequestPayload;

export default class ExtensionSignBytesRequestEvent extends BaseEvent {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(EventNameEnum.ExtensionSignBytesRequest);

    this.payload = payload;
  }
}
