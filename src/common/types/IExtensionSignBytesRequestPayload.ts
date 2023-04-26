// Types
import IBaseExtensionRequestPayload from './IBaseExtensionRequestPayload';
import IBaseSignBytesRequestPayload from './IBaseSignBytesRequestPayload';

interface IPayload {
  authorizedAddresses: string[];
}

type IExtensionSignBytesRequestPayload = IBaseExtensionRequestPayload &
  IBaseSignBytesRequestPayload &
  IPayload;

export default IExtensionSignBytesRequestPayload;
