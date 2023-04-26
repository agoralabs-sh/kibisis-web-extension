// Events
import {
  ExtensionEnableResponseEvent,
  ExtensionSignBytesResponseEvent,
  ExtensionSignTxnsResponseEvent,
} from '../events';

type IExtensionResponseEvents =
  | ExtensionEnableResponseEvent
  | ExtensionSignBytesResponseEvent
  | ExtensionSignTxnsResponseEvent;

export default IExtensionResponseEvents;
