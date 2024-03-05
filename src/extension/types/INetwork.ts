// enums
import { NetworkTypeEnum } from '../enums';

// types
import type IARC0072Indexer from './IARC0072Indexer';
import type IChainNamespace from './IChainNamespace';
import type IBlockExplorer from './IBlockExplorer';
import type INativeCurrency from './INativeCurrency';
import type INFTExplorer from './INFTExplorer';
import type INode from './INode';

interface INetwork {
  algods: INode[];
  arc0072Indexers: IARC0072Indexer[];
  blockExplorers: IBlockExplorer[];
  canonicalName: string;
  chakraTheme: string;
  feeSunkAddress: string;
  genesisHash: string;
  genesisId: string;
  indexers: INode[];
  namespace: IChainNamespace;
  nativeCurrency: INativeCurrency;
  nftExplorers: INFTExplorer[];
  type: NetworkTypeEnum;
}

export default INetwork;
