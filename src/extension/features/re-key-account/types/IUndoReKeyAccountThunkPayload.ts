// types
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IUndoReKeyAccountThunkPayload {
  account: IAccountWithExtendedProps;
  network: INetworkWithTransactionParams;
  password: string;
}

export default IUndoReKeyAccountThunkPayload;
