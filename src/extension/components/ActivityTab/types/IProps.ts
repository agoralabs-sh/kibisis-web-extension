// types
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
  IPropsWithContext,
} from '@extension/types';

interface IProps extends IPropsWithContext {
  account: IAccountWithExtendedProps;
  accounts: IAccountWithExtendedProps[];
  fetching: boolean;
  network: INetworkWithTransactionParams;
  onScrollEnd: () => void;
}

export default IProps;
