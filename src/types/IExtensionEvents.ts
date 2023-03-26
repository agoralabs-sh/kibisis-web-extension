// Events
import {
  ExtensionEnableRequestEvent,
  ExtensionEnableResponseEvent,
  ExtensionRegistrationCompletedEvent,
} from '../events';

type IExtensionEvents =
  | ExtensionEnableRequestEvent
  | ExtensionEnableResponseEvent
  | ExtensionRegistrationCompletedEvent;

export default IExtensionEvents;
