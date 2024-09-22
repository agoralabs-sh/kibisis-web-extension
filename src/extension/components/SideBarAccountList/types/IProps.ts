// types
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
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
}

export default IProps;
