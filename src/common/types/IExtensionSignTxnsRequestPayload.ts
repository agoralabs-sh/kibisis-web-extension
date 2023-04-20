import { ISignTxnsOptions } from '@agoralabs-sh/algorand-provider';

// Types
import IBaseExtensionRequestPayload from './IBaseExtensionRequestPayload';

type IExtensionSignTxnsRequestPayload = IBaseExtensionRequestPayload &
  ISignTxnsOptions;

export default IExtensionSignTxnsRequestPayload;
