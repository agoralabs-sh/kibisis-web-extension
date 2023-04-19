// Enums
import { EventNameEnum } from '@common/enums';

// Events
import BaseEvent from './BaseEvent';

// Types
import { IExtensionSignTxnsRequestPayload } from '@common/types';

type IPayload = IExtensionSignTxnsRequestPayload;

export default class ExtensionSignTxnsRequestEvent extends BaseEvent {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(EventNameEnum.ExtensionSignTxnsRequest);

    this.payload = payload;
  }
}
