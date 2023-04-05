import { BaseError } from '@agoralabs-sh/algorand-provider';

// Enums
import { EventNameEnum } from '../enums';

// Events
import BaseResponseEvent from './BaseResponseEvent';

// Types
import { IBaseSignBytesResponsePayload } from '../types';

type IPayload = IBaseSignBytesResponsePayload;

export default class ExtensionSignBytesResponseEvent extends BaseResponseEvent {
  public readonly payload: IPayload | null;

  constructor(payload: IPayload | null, error: BaseError | null) {
    super(EventNameEnum.ExtensionSignBytesResponse, error);

    this.payload = payload;
  }
}
