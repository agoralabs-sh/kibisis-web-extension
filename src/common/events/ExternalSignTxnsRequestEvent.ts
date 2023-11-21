import { ISignTxnsOptions } from '@agoralabs-sh/algorand-provider';

// enums
import { EventNameEnum } from '@common/enums';

// events
import BaseEvent from './BaseEvent';

type IPayload = ISignTxnsOptions;

export default class ExternalSignTxnsRequestEvent extends BaseEvent {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(EventNameEnum.ExternalSignTxnsRequest);

    this.payload = payload;
  }
}
