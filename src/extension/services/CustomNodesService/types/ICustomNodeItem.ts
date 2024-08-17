// types
import type { INode } from '@extension/types';

interface ICustomNodeItem {
  algod: INode;
  genesisHash: string;
  id: string;
  indexer?: INode;
  name: string;
}

export default ICustomNodeItem;
