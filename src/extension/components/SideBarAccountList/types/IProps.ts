// types
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
  ISystemInfo,
} from '@extension/types';

/**
 * @property {boolean} isShortForm - Whether the full item is being shown or just the avatar.
 */
interface IProps {
  accounts: IAccountWithExtendedProps[];
  activeAccount: IAccountWithExtendedProps | null;
  isLoading: boolean;
  isShortForm: boolean;
  network: INetworkWithTransactionParams | null;
  onClick: (id: string) => void;
  onSort: (accounts: IAccountWithExtendedProps[]) => void;
  systemInfo: ISystemInfo | null;
}

export default IProps;
