// types
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IProps {
  account: IAccountWithExtendedProps;
  accounts: IAccountWithExtendedProps[];
  fetching: boolean;
  network: INetworkWithTransactionParams;
  onScrollEnd: () => void;
}

export default IProps;
