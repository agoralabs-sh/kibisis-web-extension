// enums
import { MessageTypeEnum } from '@common/enums';

// messages
import { BaseMessage } from '@common/messages';

export default class RegistrationCompletedMessage extends BaseMessage {
  constructor() {
    super(MessageTypeEnum.RegistrationCompleted);
  }
}
