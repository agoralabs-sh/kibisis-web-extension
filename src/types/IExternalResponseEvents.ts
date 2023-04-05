// Events
import {
  ExternalEnableResponseEvent,
  ExternalSignBytesResponseEvent,
} from '../events';

type IExternalResponseEvents =
  | ExternalEnableResponseEvent
  | ExternalSignBytesResponseEvent;

export default IExternalResponseEvents;
