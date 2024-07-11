// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// types
import type { TEncryptionCredentials } from '@extension/types';

interface ISaveNewAccountPayloadFragment {
  keyPair: Ed21559KeyPair;
  name: string | null;
}

type TSaveNewAccountPayload = ISaveNewAccountPayloadFragment &
  TEncryptionCredentials;

export default TSaveNewAccountPayload;
