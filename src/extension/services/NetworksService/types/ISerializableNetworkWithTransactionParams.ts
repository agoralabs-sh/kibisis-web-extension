// types
import type {
  IBaseNetworkServiceProvider,
  INetworkWithTransactionParams,
} from '@extension/types';

interface ISerializableNetworkWithTransactionParams
  extends Omit<
    INetworkWithTransactionParams,
    'arc0072Indexers' | 'blockExplorers' | 'nftExplorers'
  > {
  arc0072Indexers: IBaseNetworkServiceProvider[];
  blockExplorers: IBaseNetworkServiceProvider[];
  nftExplorers: IBaseNetworkServiceProvider[];
}

export default ISerializableNetworkWithTransactionParams;
