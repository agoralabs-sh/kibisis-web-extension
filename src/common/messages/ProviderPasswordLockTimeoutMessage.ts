// enums
import { ProviderMessageReferenceEnum } from '@common/enums';

// messages
import BaseProviderMessage from './BaseProviderMessage';

export default class ProviderPasswordLockTimeoutMessage extends BaseProviderMessage {
  constructor() {
    super(ProviderMessageReferenceEnum.PasswordLockTimeout);
  }
}
