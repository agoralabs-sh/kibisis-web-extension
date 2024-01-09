// enums
import { InternalMessageReferenceEnum } from '@common/enums';

// messages
import BaseInternalMessage from './BaseInternalMessage';

export default class InternalRegistrationCompletedMessage extends BaseInternalMessage {
  constructor() {
    super(InternalMessageReferenceEnum.RegistrationCompleted);
  }
}
