// events
import {
  ExternalEnableResponseEvent,
  ExternalSignBytesResponseEvent,
  ExternalSignTxnsResponseEvent,
} from '../events';

type IExternalResponseEvents =
  | ExternalEnableResponseEvent
  | ExternalSignBytesResponseEvent
  | ExternalSignTxnsResponseEvent;

export default IExternalResponseEvents;
