import type { StackProps } from '@chakra-ui/react';

// models
import BaseBlockExplorer from '@extension/models/BaseBlockExplorer';

// types
import {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IModalChangeAddressItemProps extends StackProps {
  accounts: IAccountWithExtendedProps[];
  ariaLabel?: string;
  blockExplorer: BaseBlockExplorer | null;
  currentAddress: string;
  label: string;
  network: INetworkWithTransactionParams;
  newAddress: string;
}

export default IModalChangeAddressItemProps;
