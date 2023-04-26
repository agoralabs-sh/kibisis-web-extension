import { ISignTxnsResult } from '@agoralabs-sh/algorand-provider';

// Enums
import { EventNameEnum } from '@common/enums';

// Errors
import { BaseSerializableError } from '@common/errors';

// Events
import BaseResponseEvent from './BaseResponseEvent';

type IPayload = ISignTxnsResult;

export default class ExternalSignTxnsResponseEvent extends BaseResponseEvent {
  public readonly payload: IPayload | null;

  constructor(payload: IPayload | null, error: BaseSerializableError | null) {
    super(EventNameEnum.ExternalSignTxnsResponse, error);

    this.payload = payload;
  }
}
