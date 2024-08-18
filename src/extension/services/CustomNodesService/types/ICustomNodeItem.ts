// types
import type { IBaseWithDiscriminator } from '@common/types';
import type { INode } from '@extension/types';

interface ICustomNodeItem extends IBaseWithDiscriminator<'ICustomNodeItem'> {
  algod: INode;
  genesisHash: string;
  id: string;
  indexer?: INode;
  name: string;
}

export default ICustomNodeItem;
