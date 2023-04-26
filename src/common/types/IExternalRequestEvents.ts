// Events
import {
  ExternalEnableRequestEvent,
  ExternalSignBytesRequestEvent,
  ExternalSignTxnsRequestEvent,
} from '../events';

type IExternalRequestEvents =
  | ExternalEnableRequestEvent
  | ExternalSignBytesRequestEvent
  | ExternalSignTxnsRequestEvent;

export default IExternalRequestEvents;
