import { ARC0027MethodEnum } from '@agoralabs-sh/avm-web-provider';

// enums
import { NetworkTypeEnum } from '@extension/enums';

// models
import BaseARC0072Indexer from '@extension/models/BaseARC0072Indexer';
import BaseNFTExplorer from '@extension/models/BaseNFTExplorer';

// types
import type { INativeCurrency } from '../assets';
import type IChainNamespace from './IChainNamespace';
import type IBlockExplorer from './IBlockExplorer';
import type INode from './INode';

interface INetwork {
  algods: INode[];
  arc0072Indexers: BaseARC0072Indexer[];
  blockExplorers: IBlockExplorer[];
  canonicalName: string;
  chakraTheme: string;
  feeSunkAddress: string;
  genesisHash: string;
  genesisId: string;
  indexers: INode[];
  methods: ARC0027MethodEnum[];
  namespace: IChainNamespace;
  nativeCurrency: INativeCurrency;
  nftExplorers: BaseNFTExplorer[];
  type: NetworkTypeEnum;
}

export default INetwork;
