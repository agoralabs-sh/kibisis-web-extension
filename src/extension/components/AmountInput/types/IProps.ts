import type { NumberInputProps } from '@chakra-ui/react';

// types
import type {
  IAccountWithExtendedProps,
  IAssetTypes,
  INativeCurrency,
  INetworkWithTransactionParams,
} from '@extension/types';
import type IOnEventOptions from './IOnEventOptions';

interface IProps extends NumberInputProps {
  account: IAccountWithExtendedProps;
  asset: IAssetTypes | INativeCurrency;
  id?: string;
  label?: string;
  maximumAmountInAtomicUnits: string;
  network: INetworkWithTransactionParams;
  onMaximumAmountClick: (options: IOnEventOptions) => void;
  required?: boolean;
}

export default IProps;
