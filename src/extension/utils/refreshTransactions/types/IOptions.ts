import { Indexer } from 'algosdk';

// types
import type { IBaseOptions } from '@common/types';
import type { INetwork } from '@extension/types';

interface IOptions extends IBaseOptions {
  address: string;
  afterTime: number;
  client: Indexer;
  delay?: number;
  next: string | null;
  network: INetwork;
}

export default IOptions;
