// types
import type { INode } from '@extension/types';

interface ICustomNode {
  algod: Omit<INode, 'canonicalName' | 'id'> | null;
  genesisHash: string;
  id: string;
  indexer: Omit<INode, 'canonicalName' | 'id'> | null;
  name: string;
}

export default ICustomNode;
