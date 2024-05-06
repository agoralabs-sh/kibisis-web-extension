import type { Indexer } from 'algosdk';

interface IOptions {
  assetId: string | null;
  client: Indexer;
  delay: number;
  limit: number;
  name: string | null;
  next: string | null;
  unit: string | null;
}

export default IOptions;
