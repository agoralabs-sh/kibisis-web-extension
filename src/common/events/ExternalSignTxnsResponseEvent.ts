import { ISignTxnsResult } from '@agoralabs-sh/algorand-provider';

// enums
import { EventNameEnum } from '@common/enums';

// errors
import { BaseSerializableError } from '@common/errors';

// events
import BaseResponseEvent from './BaseResponseEvent';

type IPayload = ISignTxnsResult;

export default class ExternalSignTxnsResponseEvent extends BaseResponseEvent {
  public readonly payload: IPayload | null;

  constructor(payload: IPayload | null, error: BaseSerializableError | null) {
    super(EventNameEnum.ExternalSignTxnsResponse, error);

    this.payload = payload;
  }
}
