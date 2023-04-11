// Events
import {
  ExtensionEnableRequestEvent,
  ExtensionEnableResponseEvent,
  ExtensionRegistrationCompletedEvent,
  ExtensionSignBytesRequestEvent,
  ExtensionSignBytesResponseEvent,
} from '@common/events';

type IExtensionEvents =
  | ExtensionEnableRequestEvent
  | ExtensionEnableResponseEvent
  | ExtensionRegistrationCompletedEvent
  | ExtensionSignBytesRequestEvent
  | ExtensionSignBytesResponseEvent;

export default IExtensionEvents;
