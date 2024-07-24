// types
import type {
  IAssetTypes,
  INativeCurrency,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IProps {
  asset: IAssetTypes | INativeCurrency;
  network: INetworkWithTransactionParams;
}

export default IProps;
