// Enums
import { NetworkTypeEnum } from '../enums';

// Types
import INativeCurrency from './INativeCurrency';
import INode from './INode';

interface INetwork {
  canonicalName: string;
  genesisHash: string;
  genesisId: string;
  nativeCurrency: INativeCurrency;
  nodes: INode[];
  type: NetworkTypeEnum;
}

export default INetwork;
