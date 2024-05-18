// types
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
} from '@extension/types';

interface ISideBarAccountItemProps {
  account: IAccountWithExtendedProps;
  active: boolean;
  network?: INetworkWithTransactionParams;
  onClick: (id: string) => void;
}

export default ISideBarAccountItemProps;
