import type { StackProps } from '@chakra-ui/react';

// types
import {
  IAccountWithExtendedProps,
  IBlockExplorer,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IModalChangeAddressItemProps extends StackProps {
  accounts: IAccountWithExtendedProps[];
  ariaLabel?: string;
  blockExplorer: IBlockExplorer | null;
  currentAddress: string;
  label: string;
  network: INetworkWithTransactionParams;
  newAddress: string;
}

export default IModalChangeAddressItemProps;
