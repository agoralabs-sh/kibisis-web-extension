// Types
import IBaseExtensionRequestPayload from './IBaseExtensionRequestPayload';
import IBaseSignBytesRequestPayload from './IBaseSignBytesRequestPayload';

type IExtensionSignBytesRequestPayload = IBaseExtensionRequestPayload &
  IBaseSignBytesRequestPayload;

export default IExtensionSignBytesRequestPayload;
