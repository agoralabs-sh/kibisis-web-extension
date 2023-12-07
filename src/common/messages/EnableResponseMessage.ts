import { IEnableResult } from '@agoralabs-sh/algorand-provider';

// enums
import { MessageTypeEnum } from '@common/enums';

// errors
import { BaseSerializableError } from '@common/errors';

// messages
import BaseResponseMessage from './BaseResponseMessage';

type IPayload = IEnableResult;

export default class EnableResponseMessage extends BaseResponseMessage {
  public readonly payload: IPayload | null;

  constructor(payload: IPayload | null, error: BaseSerializableError | null) {
    super(MessageTypeEnum.EnableResponse, error);

    this.payload = payload;
  }
}
