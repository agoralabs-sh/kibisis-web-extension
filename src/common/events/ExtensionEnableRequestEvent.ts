// enums
import { EventNameEnum } from '@common/enums';

// events
import BaseEvent from './BaseEvent';

// types
import { IExtensionEnableRequestPayload } from '@common/types';

type IPayload = IExtensionEnableRequestPayload;

export default class ExtensionEnableRequestEvent extends BaseEvent {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(EventNameEnum.ExtensionEnableRequest);

    this.payload = payload;
  }
}
