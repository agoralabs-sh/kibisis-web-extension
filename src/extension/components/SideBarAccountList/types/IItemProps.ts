// types
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
  ISystemInfo,
} from '@extension/types';

/**
 * @property {boolean} isShortForm - Whether the full item is being shown or just the avatar.
 */
interface IItemProps {
  account: IAccountWithExtendedProps;
  accounts: IAccountWithExtendedProps[];
  active: boolean;
  isShortForm: boolean;
  network: INetworkWithTransactionParams;
  onClick: (id: string) => void;
  systemInfo: ISystemInfo | null;
}

export default IItemProps;
