// enums
import { InternalMessageReferenceEnum } from '@common/enums';

// messages
import BaseInternalMessage from './BaseInternalMessage';

export default class InternalPasswordLockTimeoutMessage extends BaseInternalMessage {
  constructor() {
    super(InternalMessageReferenceEnum.PasswordLockTimeout);
  }
}
