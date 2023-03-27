// Types
import INativeCurrency from './INativeCurrency';
import INode from './INode';

interface INetwork {
  genesisHash: string;
  genesisId: string;
  nativeCurrency: INativeCurrency;
  nodes: INode[];
}

export default INetwork;
