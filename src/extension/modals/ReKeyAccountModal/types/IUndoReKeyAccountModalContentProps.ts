// types
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IUndoReKeyAccountModalContentProps {
  account: IAccountWithExtendedProps;
  accounts: IAccountWithExtendedProps[];
  authAddress: string;
  network: INetworkWithTransactionParams;
}

export default IUndoReKeyAccountModalContentProps;
