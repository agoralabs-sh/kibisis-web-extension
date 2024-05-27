// types
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
} from '@extension/types';
import type { TReKeyType } from '@extension/features/re-key-account';

interface IConfirmingModalContentProps {
  accounts: IAccountWithExtendedProps[];
  currentAddress: string;
  network: INetworkWithTransactionParams;
  reKeyAddress: string;
  reKeyType: TReKeyType;
}

export default IConfirmingModalContentProps;
