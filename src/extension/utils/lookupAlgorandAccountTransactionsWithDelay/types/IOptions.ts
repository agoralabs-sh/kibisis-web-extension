import { Indexer } from 'algosdk';

// types
import type { IBaseOptions } from '@common/types';

interface IOptions extends IBaseOptions {
  address: string;
  afterTime: number | null;
  client: Indexer;
  delay: number;
  limit: number;
  next: string | null;
}

export default IOptions;
