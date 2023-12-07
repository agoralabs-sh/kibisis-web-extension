import { v4 as uuid } from 'uuid';

// enums
import { MessageTypeEnum } from '@common/enums';

export default class BaseMessage {
  public readonly id: string;
  public readonly type: MessageTypeEnum;

  constructor(type: MessageTypeEnum) {
    this.id = uuid();
    this.type = type;
  }
}
