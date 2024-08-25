// types
import type {
  IAssetTypes,
  INativeCurrency,
  INetworkWithTransactionParams,
  IPropsWithContext,
} from '@extension/types';

interface IProps extends IPropsWithContext {
  assets: (IAssetTypes | INativeCurrency)[];
  disabled?: boolean;
  label?: string;
  network: INetworkWithTransactionParams;
  onSelect: (account: IAssetTypes | INativeCurrency) => void;
  required?: boolean;
  value: IAssetTypes | INativeCurrency;
}

export default IProps;
