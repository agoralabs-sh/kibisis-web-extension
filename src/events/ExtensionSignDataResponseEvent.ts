import { BaseError } from '@agoralabs-sh/algorand-provider';

// Enums
import { EventNameEnum } from '../enums';

// Events
import BaseResponseEvent from './BaseResponseEvent';

/**
 * @property {string} signature - the base64 encoded signature of the signed data with the MX prefix.
 */
interface IPayload {
  signature: string;
}

export default class ExtensionSignDataResponseEvent extends BaseResponseEvent {
  public readonly payload: IPayload | null;

  constructor(payload: IPayload | null, error: BaseError | null) {
    super(EventNameEnum.ExtensionSignDataResponse, error);

    this.payload = payload;
  }
}
