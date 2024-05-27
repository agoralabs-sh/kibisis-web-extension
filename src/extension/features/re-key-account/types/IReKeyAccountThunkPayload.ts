// types
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IUndoReKeyAccountThunkPayload {
  authorizedAddress: string;
  network: INetworkWithTransactionParams;
  password: string;
  reKeyAccount: IAccountWithExtendedProps;
}

export default IUndoReKeyAccountThunkPayload;
