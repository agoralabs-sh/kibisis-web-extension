// enums
import { EventNameEnum } from '@common/enums';

// errors
import { BaseSerializableError } from '@common/errors';

// events
import BaseExtensionResponseEvent from './BaseExtensionResponseEvent';

// types
import { IBaseSignBytesResponsePayload } from '@common/types';

type IPayload = IBaseSignBytesResponsePayload;

export default class ExtensionSignBytesResponseEvent extends BaseExtensionResponseEvent {
  public readonly payload: IPayload | null;

  constructor(
    requestEventId: string,
    payload: IPayload | null,
    error: BaseSerializableError | null
  ) {
    super(EventNameEnum.ExtensionSignBytesResponse, requestEventId, error);

    this.payload = payload;
  }
}
