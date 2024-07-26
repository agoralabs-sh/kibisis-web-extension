// types
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
  TEncryptionCredentials,
} from '@extension/types';

interface IUndoReKeyAccountThunkPayload {
  network: INetworkWithTransactionParams;
  reKeyAccount: IAccountWithExtendedProps;
}

type TUndoReKeyAccountThunkPayload = IUndoReKeyAccountThunkPayload &
  TEncryptionCredentials;

export default TUndoReKeyAccountThunkPayload;
