// messages
import {
  ProviderEventAddedMessage,
  ProviderPasswordLockTimeoutMessage,
} from '@common/messages';

type TProviderMessages =
  | ProviderEventAddedMessage
  | ProviderPasswordLockTimeoutMessage;

export default TProviderMessages;
