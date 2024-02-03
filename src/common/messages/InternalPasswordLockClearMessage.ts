// enums
import { InternalMessageReferenceEnum } from '@common/enums';

// messages
import BaseInternalMessage from './BaseInternalMessage';

export default class InternalPasswordLockClearMessage extends BaseInternalMessage {
  constructor() {
    super(InternalMessageReferenceEnum.PasswordLockClear);
  }
}
