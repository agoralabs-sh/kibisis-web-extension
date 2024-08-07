// messages
import {
  ProviderEventAddedMessage,
  ProviderCredentialLockActivatedMessage,
} from '@common/messages';

type TProviderMessages =
  | ProviderEventAddedMessage
  | ProviderCredentialLockActivatedMessage;

export default TProviderMessages;
