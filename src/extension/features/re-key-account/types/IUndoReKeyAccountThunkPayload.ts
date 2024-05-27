// types
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IUndoReKeyAccountThunkPayload {
  network: INetworkWithTransactionParams;
  password: string;
  reKeyAccount: IAccountWithExtendedProps;
}

export default IUndoReKeyAccountThunkPayload;
