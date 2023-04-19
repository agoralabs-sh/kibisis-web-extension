import { BaseError, ISignTxnsResult } from '@agoralabs-sh/algorand-provider';

// Enums
import { EventNameEnum } from '@common/enums';

// Events
import BaseResponseEvent from './BaseResponseEvent';

type IPayload = ISignTxnsResult;

export default class ExtensionSignTxnsResponseEvent extends BaseResponseEvent {
  public readonly payload: IPayload | null;

  constructor(payload: IPayload | null, error: BaseError | null) {
    super(EventNameEnum.ExtensionSignTxnsResponse, error);

    this.payload = payload;
  }
}
