import { Indexer } from 'algosdk';

interface IOptions {
  address: string;
  afterTime: number | null;
  client: Indexer;
  delay: number;
  limit: number;
  next: string | null;
}

export default IOptions;
