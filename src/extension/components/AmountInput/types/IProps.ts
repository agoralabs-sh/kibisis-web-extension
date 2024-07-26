// types
import type {
  IAccountWithExtendedProps,
  IAssetTypes,
  INativeCurrency,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IProps {
  account: IAccountWithExtendedProps;
  asset: IAssetTypes | INativeCurrency;
  disabled?: boolean;
  id?: string;
  network: INetworkWithTransactionParams;
  maximumTransactionAmount: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string | null;
}

export default IProps;
