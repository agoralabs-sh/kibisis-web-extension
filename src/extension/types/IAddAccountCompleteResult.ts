// types
import IARC0200Asset from './IARC0200Asset';

interface IAddAccountCompleteResult {
  arc0200Assets: IARC0200Asset[];
  name: string | null;
  privateKey: Uint8Array;
}

export default IAddAccountCompleteResult;
