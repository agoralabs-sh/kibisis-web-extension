// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

interface IAddAccountCompleteResult {
  name: string | null;
  keyPair: Ed21559KeyPair;
}

export default IAddAccountCompleteResult;
