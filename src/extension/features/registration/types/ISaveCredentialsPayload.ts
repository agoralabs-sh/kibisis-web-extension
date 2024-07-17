// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// types
import type { IARC0200Asset } from '@extension/types';

interface ISaveCredentialsPayload {
  arc0200Assets: IARC0200Asset[];
  keyPair: Ed21559KeyPair;
  name: string | null;
}

export default ISaveCredentialsPayload;
