import type { Indexer } from 'algosdk';

interface IOptions {
  applicationId: string;
  client: Indexer;
  delay: number;
  limit: number;
  next: string | null;
}

export default IOptions;
