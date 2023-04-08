// Enums
import { EventNameEnum } from '@common/enums';

// Events
import BaseEvent from './BaseEvent';

// Types
import { IExtensionEnableRequestPayload } from '@common/types';

type IPayload = IExtensionEnableRequestPayload;

export default class ExtensionEnableRequestEvent extends BaseEvent {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(EventNameEnum.ExtensionEnableRequest);

    this.payload = payload;
  }
}
