// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

interface ISaveNewAccountPayload {
  keyPair: Ed21559KeyPair;
  name: string | null;
  password: string;
}

export default ISaveNewAccountPayload;
