// Enums
import { NetworkTypeEnum } from '../enums';

// Types
import IChainNamespace from './IChainNamespace';
import IExplorer from './IExplorer';
import INativeCurrency from './INativeCurrency';
import INode from './INode';

interface INetwork {
  canonicalName: string;
  chakraTheme: string;
  explorers: IExplorer[];
  genesisHash: string;
  genesisId: string;
  namespace: IChainNamespace;
  nativeCurrency: INativeCurrency;
  indexers: INode[];
  algods: INode[];
  type: NetworkTypeEnum;
}

export default INetwork;
