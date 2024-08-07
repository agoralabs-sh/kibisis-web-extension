// types
import type {
  INewAccount,
  IPasskeyEncryptionCredentials,
  IPasswordEncryptionCredentials,
} from '@extension/types';

interface ISaveNewAccountsPayloadFragment {
  accounts: INewAccount[];
}

type TSaveNewAccountsPayload = ISaveNewAccountsPayloadFragment &
  (IPasskeyEncryptionCredentials | IPasswordEncryptionCredentials);

export default TSaveNewAccountsPayload;
