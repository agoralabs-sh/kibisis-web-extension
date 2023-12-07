// enums
import { MessageTypeEnum } from '@common/enums';

// messages
import BaseMessage from './BaseMessage';

// types
import { IBaseRequestPayload } from '@common/types';

interface IPayload extends IBaseRequestPayload {
  genesisHash: string | null;
}

export default class EnableRequestMessage extends BaseMessage {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(MessageTypeEnum.EnableRequest);

    this.payload = payload;
  }
}
