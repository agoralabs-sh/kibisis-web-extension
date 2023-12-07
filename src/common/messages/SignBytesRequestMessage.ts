// enums
import { MessageTypeEnum } from '@common/enums';

// messages
import BaseMessage from './BaseMessage';

// types
import {
  IBaseRequestPayload,
  IBaseSignBytesRequestPayload,
} from '@common/types';

type IPayload = IBaseRequestPayload & IBaseSignBytesRequestPayload;

export default class SignBytesRequestMessage extends BaseMessage {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(MessageTypeEnum.SignBytesRequest);

    this.payload = payload;
  }
}
