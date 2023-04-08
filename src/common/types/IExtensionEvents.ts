// Events
import {
  ExtensionEnableRequestEvent,
  ExtensionEnableResponseEvent,
  ExtensionRegistrationCompletedEvent,
  ExtensionSignBytesRequestEvent,
  ExtensionSignBytesResponseEvent,
} from '../events';

type IExtensionEvents =
  | ExtensionEnableRequestEvent
  | ExtensionEnableResponseEvent
  | ExtensionRegistrationCompletedEvent
  | ExtensionSignBytesRequestEvent
  | ExtensionSignBytesResponseEvent;

export default IExtensionEvents;
