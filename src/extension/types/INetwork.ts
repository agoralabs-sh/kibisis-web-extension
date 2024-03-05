// enums
import { NetworkTypeEnum } from '../enums';

// types
import IARC0072Indexer from './IARC0072Indexer';
import IChainNamespace from './IChainNamespace';
import IExplorer from './IExplorer';
import INativeCurrency from './INativeCurrency';
import INode from './INode';

interface INetwork {
  algods: INode[];
  arc0072Indexers: IARC0072Indexer[];
  canonicalName: string;
  chakraTheme: string;
  explorers: IExplorer[];
  feeSunkAddress: string;
  genesisHash: string;
  genesisId: string;
  indexers: INode[];
  namespace: IChainNamespace;
  nativeCurrency: INativeCurrency;
  type: NetworkTypeEnum;
}

export default INetwork;
