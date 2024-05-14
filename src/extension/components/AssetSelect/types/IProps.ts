// types
import type {
  IAccount,
  IAssetTypes,
  INativeCurrency,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IProps {
  account: IAccount;
  assets: (IAssetTypes | INativeCurrency)[];
  disabled?: boolean;
  network: INetworkWithTransactionParams;
  onAssetChange: (value: IAssetTypes | INativeCurrency) => void;
  value: IAssetTypes | INativeCurrency;
  width?: string | number;
}

export default IProps;
