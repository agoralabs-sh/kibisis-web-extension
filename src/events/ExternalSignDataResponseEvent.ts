// Enums
import { EventNameEnum } from '../enums';

// Errors
import { BaseSerializableError } from '../errors';

// Events
import BaseResponseEvent from './BaseResponseEvent';

/**
 * @property {string} signature - the base64 encoded signature of the signed data with the MX prefix.
 */
interface IPayload {
  signature: string;
}

export default class ExternalSignDataResponseEvent extends BaseResponseEvent {
  public readonly payload: IPayload | null;

  constructor(payload: IPayload | null, error: BaseSerializableError | null) {
    super(EventNameEnum.ExtensionSignDataResponse, error);

    this.payload = payload;
  }
}
