// enums
import { ProviderMessageReferenceEnum } from '@common/enums';

// messages
import BaseProviderMessage from './BaseProviderMessage';

export default class ProviderFactoryResetMessage extends BaseProviderMessage {
  constructor() {
    super(ProviderMessageReferenceEnum.FactoryReset);
  }
}
