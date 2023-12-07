import { ISignTxnsOptions } from '@agoralabs-sh/algorand-provider';

// enums
import { MessageTypeEnum } from '@common/enums';

// messages
import BaseMessage from './BaseMessage';

// types
import { IBaseRequestPayload } from '@common/types';

type IPayload = IBaseRequestPayload & ISignTxnsOptions;

export default class SignTxnsRequestMessage extends BaseMessage {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(MessageTypeEnum.SignTxnsRequest);

    this.payload = payload;
  }
}
