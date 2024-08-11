// enums
import { ProviderMessageReferenceEnum } from '@common/enums';

// messages
import BaseProviderMessage from './BaseProviderMessage';

export default class ProviderCredentialLockActivatedMessage extends BaseProviderMessage {
  constructor() {
    super(ProviderMessageReferenceEnum.CredentialLockActivated);
  }
}
