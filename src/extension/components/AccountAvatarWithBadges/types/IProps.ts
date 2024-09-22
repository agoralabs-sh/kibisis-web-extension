// types
import type {
  IAccountWithExtendedProps,
  INetwork,
  ISystemInfo,
} from '@extension/types';

interface IProps {
  account: IAccountWithExtendedProps;
  accounts: IAccountWithExtendedProps[];
  network: INetwork;
  systemInfo: ISystemInfo | null;
}

export default IProps;
