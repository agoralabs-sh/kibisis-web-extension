// Types
import IBaseEnableRequestPayload from './IBaseEnableRequestPayload';
import IBaseExtensionRequestPayload from './IBaseExtensionRequestPayload';

type IExtensionEnableRequestPayload = IBaseExtensionRequestPayload &
  IBaseEnableRequestPayload;

export default IExtensionEnableRequestPayload;
