// types
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IProps {
  accounts: IAccountWithExtendedProps[];
  activeAccount: IAccountWithExtendedProps | null;
  isLoading: boolean;
  network: INetworkWithTransactionParams | null;
  onClick: (id: string) => void;
  onSort: (accounts: IAccountWithExtendedProps[]) => void;
}

export default IProps;
