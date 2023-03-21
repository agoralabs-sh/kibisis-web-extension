// Events
import {
  InternalEnableRequestEvent,
  InternalRegistrationCompletedEvent,
} from '../events';

type IInternalEvents =
  | InternalEnableRequestEvent
  | InternalRegistrationCompletedEvent;

export default IInternalEvents;
