import { IEnableResult } from '@agoralabs-sh/algorand-provider';

// Enums
import { EventNameEnum } from '@common/enums';

// Errors
import { BaseSerializableError } from '@common/errors';

// Events
import BaseResponseEvent from './BaseResponseEvent';

export default class ExternalEnableResponseEvent extends BaseResponseEvent {
  public readonly payload: IEnableResult | null;

  constructor(
    payload: IEnableResult | null,
    error: BaseSerializableError | null
  ) {
    super(EventNameEnum.ExternalEnableResponse, error);

    this.payload = payload;
  }
}
