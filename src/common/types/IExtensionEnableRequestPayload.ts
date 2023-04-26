// Types
import { INetwork } from '@extension/types';
import IBaseExtensionRequestPayload from './IBaseExtensionRequestPayload';

interface IExtensionEnableRequestPayload extends IBaseExtensionRequestPayload {
  network: INetwork;
}

export default IExtensionEnableRequestPayload;
