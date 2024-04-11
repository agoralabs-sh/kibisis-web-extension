// enums
import { ProviderMessageReferenceEnum } from '@common/enums';

// messages
import BaseProviderMessage from './BaseProviderMessage';

export default class ProviderRegistrationCompletedMessage extends BaseProviderMessage {
  constructor() {
    super(ProviderMessageReferenceEnum.RegistrationCompleted);
  }
}
