// enums
import { EventNameEnum } from '@common/enums';

// errors
import { BaseSerializableError } from '@common/errors';

// events
import BaseResponseEvent from './BaseResponseEvent';

// types
import { IBaseSignBytesResponsePayload } from '@common/types';

type IPayload = IBaseSignBytesResponsePayload;

export default class ExternalSignBytesResponseEvent extends BaseResponseEvent {
  public readonly payload: IPayload | null;

  constructor(payload: IPayload | null, error: BaseSerializableError | null) {
    super(EventNameEnum.ExternalSignBytesResponse, error);

    this.payload = payload;
  }
}
