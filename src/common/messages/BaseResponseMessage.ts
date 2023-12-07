// enums
import { MessageTypeEnum } from '@common/enums';

// errors
import { BaseSerializableError } from '@common/errors';

// messages
import BaseMessage from './BaseMessage';

export default class BaseResponseMessage extends BaseMessage {
  public readonly error: BaseSerializableError | null;

  constructor(type: MessageTypeEnum, error: BaseSerializableError | null) {
    super(type);

    this.error = error;
  }
}
