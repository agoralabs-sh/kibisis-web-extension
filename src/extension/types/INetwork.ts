// enums
import { NetworkTypeEnum } from '../enums';

// types
import IChainNamespace from './IChainNamespace';
import IExplorer from './IExplorer';
import INativeCurrency from './INativeCurrency';
import INode from './INode';

interface INetwork {
  canonicalName: string;
  chakraTheme: string;
  explorers: IExplorer[];
  feeSunkAddress: string;
  genesisHash: string;
  genesisId: string;
  namespace: IChainNamespace;
  nativeCurrency: INativeCurrency;
  indexers: INode[];
  algods: INode[];
  type: NetworkTypeEnum;
}

export default INetwork;
