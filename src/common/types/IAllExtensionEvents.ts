// events
import {
  ExtensionBackgroundAppLoadEvent,
  ExtensionRegistrationCompletedEvent,
  ExtensionResetEvent,
} from '@common/events';

// types
import IExtensionRequestEvents from './IExternalRequestEvents';
import IExtensionResponseEvents from './IExtensionResponseEvents';

type IAllExtensionEvents =
  | ExtensionBackgroundAppLoadEvent
  | IExtensionRequestEvents
  | IExtensionResponseEvents
  | ExtensionRegistrationCompletedEvent
  | ExtensionResetEvent;

export default IAllExtensionEvents;
