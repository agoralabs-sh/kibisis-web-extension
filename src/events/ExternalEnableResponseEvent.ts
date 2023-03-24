import { IEnableResult } from '@agoralabs-sh/algorand-provider';

// Enums
import { EventNameEnum } from '../enums';

// Errors
import { BaseSerializableError } from '../errors';

// Events
import BaseResponseEvent from './BaseResponseEvent';

type IPayload = IEnableResult;

export default class ExternalEnableResponseEvent extends BaseResponseEvent {
  public readonly payload: IPayload | null;

  constructor(payload: IPayload | null, error: BaseSerializableError | null) {
    super(EventNameEnum.ExternalEnableResponse, error);

    this.payload = payload;
  }
}
