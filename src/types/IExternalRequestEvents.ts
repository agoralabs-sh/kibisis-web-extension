// Events
import {
  ExternalEnableRequestEvent,
  ExternalSignBytesRequestEvent,
} from '../events';

type IExternalRequestEvents =
  | ExternalEnableRequestEvent
  | ExternalSignBytesRequestEvent;

export default IExternalRequestEvents;
