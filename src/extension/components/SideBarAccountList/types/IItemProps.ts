// types
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IItemProps {
  account: IAccountWithExtendedProps;
  accounts: IAccountWithExtendedProps[];
  active: boolean;
  network: INetworkWithTransactionParams;
  onClick: (id: string) => void;
}

export default IItemProps;
