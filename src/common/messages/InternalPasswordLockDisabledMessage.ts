// enums
import { InternalMessageReferenceEnum } from '@common/enums';

// messages
import BaseInternalMessage from './BaseInternalMessage';

export default class InternalPasswordLockDisabledMessage extends BaseInternalMessage {
  constructor() {
    super(InternalMessageReferenceEnum.PasswordLockDisabled);
  }
}
