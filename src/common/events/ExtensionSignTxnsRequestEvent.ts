// enums
import { EventNameEnum } from '@common/enums';

// events
import BaseEvent from './BaseEvent';

// types
import { IExtensionSignTxnsRequestPayload } from '@common/types';

type IPayload = IExtensionSignTxnsRequestPayload;

export default class ExtensionSignTxnsRequestEvent extends BaseEvent {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(EventNameEnum.ExtensionSignTxnsRequest);

    this.payload = payload;
  }
}
