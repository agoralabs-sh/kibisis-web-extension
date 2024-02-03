// enums
import { InternalMessageReferenceEnum } from '@common/enums';

// messages
import BaseInternalMessage from './BaseInternalMessage';

export default class InternalPasswordLockEnabledMessage extends BaseInternalMessage {
  constructor() {
    super(InternalMessageReferenceEnum.PasswordLockCleared);
  }
}
