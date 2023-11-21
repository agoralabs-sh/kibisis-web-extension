import { IEnableResult } from '@agoralabs-sh/algorand-provider';

// enums
import { EventNameEnum } from '@common/enums';

// errors
import { BaseSerializableError } from '@common/errors';

// events
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
