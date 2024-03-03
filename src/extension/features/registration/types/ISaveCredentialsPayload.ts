// types
import type { IARC0200Asset } from '@extension/types';

interface ISaveCredentialsPayload {
  arc0200Assets: IARC0200Asset[];
  name: string | null;
  privateKey: Uint8Array;
}

export default ISaveCredentialsPayload;
