import { ISignTxnsOptions } from '@agoralabs-sh/algorand-provider';

// Enums
import { EventNameEnum } from '@common/enums';

// Events
import BaseEvent from './BaseEvent';

type IPayload = ISignTxnsOptions;

export default class ExternalSignTxnsRequestEvent extends BaseEvent {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(EventNameEnum.ExternalSignTxnsRequest);

    this.payload = payload;
  }
}
