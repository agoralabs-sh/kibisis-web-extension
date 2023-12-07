// enums
import { MessageTypeEnum } from '@common/enums';

// errors
import { BaseSerializableError } from '@common/errors';

// messages
import BaseResponseMessage from './BaseResponseMessage';

// types
import { IBaseSignBytesResponsePayload } from '@common/types';

type IPayload = IBaseSignBytesResponsePayload;

export default class SignBytesResponseMessage extends BaseResponseMessage {
  public readonly payload: IPayload | null;

  constructor(payload: IPayload | null, error: BaseSerializableError | null) {
    super(MessageTypeEnum.SignBytesResponse, error);

    this.payload = payload;
  }
}
