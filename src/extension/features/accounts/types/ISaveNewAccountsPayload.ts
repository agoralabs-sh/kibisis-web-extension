// types
import type { INewAccount, TEncryptionCredentials } from '@extension/types';

interface ISaveNewAccountsPayloadFragment {
  accounts: INewAccount[];
}

type TSaveNewAccountsPayload = ISaveNewAccountsPayloadFragment &
  TEncryptionCredentials;

export default TSaveNewAccountsPayload;
