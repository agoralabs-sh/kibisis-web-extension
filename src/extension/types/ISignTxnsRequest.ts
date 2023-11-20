import { IWalletTransaction } from '@agoralabs-sh/algorand-provider';

// types
import IBaseRequest from './IBaseRequest';
import INetwork from './INetwork';

interface ISignTxnsRequest extends IBaseRequest {
  network: INetwork;
  transactions: IWalletTransaction[];
}

export default ISignTxnsRequest;
