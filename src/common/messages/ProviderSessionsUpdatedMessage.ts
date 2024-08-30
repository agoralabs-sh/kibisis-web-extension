// enums
import { ProviderMessageReferenceEnum } from '@common/enums';

// messages
import BaseProviderMessage from './BaseProviderMessage';

export default class ProviderSessionsUpdatedMessage extends BaseProviderMessage {
  constructor() {
    super(ProviderMessageReferenceEnum.SessionsUpdated);
  }
}
