import { ISignTxnsOptions } from '@agoralabs-sh/algorand-provider';

// types
import { INetwork } from '@extension/types';
import IBaseExtensionRequestPayload from './IBaseExtensionRequestPayload';

interface IPayload {
  authorizedAddresses: string[];
  network: INetwork;
}

type IExtensionSignTxnsRequestPayload = IBaseExtensionRequestPayload &
  ISignTxnsOptions &
  IPayload;

export default IExtensionSignTxnsRequestPayload;
