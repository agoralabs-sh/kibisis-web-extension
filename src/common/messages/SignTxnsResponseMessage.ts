import { ISignTxnsResult } from '@agoralabs-sh/algorand-provider';

// enums
import { MessageTypeEnum } from '@common/enums';

// errors
import { BaseSerializableError } from '@common/errors';

// messages
import BaseResponseMessage from './BaseResponseMessage';

type IPayload = ISignTxnsResult;

export default class SignTxnsResponseMessage extends BaseResponseMessage {
  public readonly payload: IPayload | null;

  constructor(payload: IPayload | null, error: BaseSerializableError | null) {
    super(MessageTypeEnum.SignTxnsResponse, error);

    this.payload = payload;
  }
}
