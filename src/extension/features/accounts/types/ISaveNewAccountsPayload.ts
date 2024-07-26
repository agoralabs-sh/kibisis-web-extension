// types
import type { TEncryptionCredentials } from '@extension/types';
import type INewAccount from './INewAccount';

interface ISaveNewAccountsPayloadFragment {
  accounts: INewAccount[];
}

type TSaveNewAccountsPayload = ISaveNewAccountsPayloadFragment &
  TEncryptionCredentials;

export default TSaveNewAccountsPayload;
