// enums
import { ProviderMessageReferenceEnum } from '@common/enums';

// messages
import BaseProviderMessage from './BaseProviderMessage';

export default class ProviderPasswordLockClearMessage extends BaseProviderMessage {
  constructor() {
    super(ProviderMessageReferenceEnum.PasswordLockClear);
  }
}
