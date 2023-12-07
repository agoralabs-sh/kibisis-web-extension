// enums
import { MessageTypeEnum } from '@common/enums';

// messages
import { BaseMessage } from '@common/messages';

export default class FactoryResetMessage extends BaseMessage {
  constructor() {
    super(MessageTypeEnum.FactoryReset);
  }
}
