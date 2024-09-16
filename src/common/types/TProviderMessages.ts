// messages
import {
  ProviderEventAddedMessage,
  ProviderCredentialLockActivatedMessage,
  ProviderSessionsUpdatedMessage,
} from '@common/messages';

type TProviderMessages =
  | ProviderEventAddedMessage
  | ProviderCredentialLockActivatedMessage
  | ProviderSessionsUpdatedMessage;

export default TProviderMessages;
