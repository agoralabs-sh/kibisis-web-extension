// types
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
  TEncryptionCredentials,
} from '@extension/types';

interface IReKeyAccountThunkPayload {
  authorizedAddress: string;
  network: INetworkWithTransactionParams;
  reKeyAccount: IAccountWithExtendedProps;
}

type TReKeyAccountThunkPayload = IReKeyAccountThunkPayload &
  TEncryptionCredentials;

export default TReKeyAccountThunkPayload;
