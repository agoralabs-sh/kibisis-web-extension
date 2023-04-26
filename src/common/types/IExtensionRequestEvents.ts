// Events
import {
  ExtensionEnableRequestEvent,
  ExtensionSignBytesRequestEvent,
  ExtensionSignTxnsRequestEvent,
} from '../events';

type IExtensionRequestEvents =
  | ExtensionEnableRequestEvent
  | ExtensionSignBytesRequestEvent
  | ExtensionSignTxnsRequestEvent;

export default IExtensionRequestEvents;
