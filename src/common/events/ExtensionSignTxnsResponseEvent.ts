import { ISignTxnsResult } from '@agoralabs-sh/algorand-provider';

// Enums
import { EventNameEnum } from '@common/enums';

// Errors
import { BaseSerializableError } from '@common/errors';

// Events
import BaseExtensionResponseEvent from './BaseExtensionResponseEvent';

type IPayload = ISignTxnsResult;

export default class ExtensionSignTxnsResponseEvent extends BaseExtensionResponseEvent {
  public readonly payload: IPayload | null;

  constructor(
    requestEventId: string,
    payload: IPayload | null,
    error: BaseSerializableError | null
  ) {
    super(EventNameEnum.ExtensionSignTxnsResponse, requestEventId, error);

    this.payload = payload;
  }
}
