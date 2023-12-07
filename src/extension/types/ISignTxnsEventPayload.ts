import { ISignTxnsOptions } from '@agoralabs-sh/algorand-provider';

// types
import { IBaseRequestPayload } from '@common/types';
import INetwork from './INetwork';

type ISignTxnsEventPayload = IBaseRequestPayload &
  ISignTxnsOptions & {
    authorizedAddresses: string[];
    network: INetwork;
  };

export default ISignTxnsEventPayload;
