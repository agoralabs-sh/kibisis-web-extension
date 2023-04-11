// Enums
import { EventNameEnum } from '@common/enums';

// Errors
import { BaseSerializableError } from '@common/errors';

// Events
import BaseResponseEvent from './BaseResponseEvent';

// Types
import { IBaseSignBytesResponsePayload } from '@common/types';

type IPayload = IBaseSignBytesResponsePayload;

export default class ExternalSignBytesResponseEvent extends BaseResponseEvent {
  public readonly payload: IPayload | null;

  constructor(payload: IPayload | null, error: BaseSerializableError | null) {
    super(EventNameEnum.ExternalSignBytesResponse, error);

    this.payload = payload;
  }
}
